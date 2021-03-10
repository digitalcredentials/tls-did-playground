import { rootCertificates } from 'tls';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { performance } from 'perf_hooks';
import { TLSDID as MaliciousTLSDID } from './maliciouslib/maliciousTlsDid.js';
import { TLSDID } from '@digitalcredentials/tls-did';
import { getResolver } from '@digitalcredentials/tls-did-resolver';
import { Resolver } from 'did-resolver';
import localEnv from '../../environment.json';
import publicEnv from '../../publicEnv.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let REGISTRY;
let jsonRpcUrl;
let etherPrivateKey;

let certPath;
let cert;
let intermediateCertPath;
let intermediateCert;
let chain;

let pemKeyPath;
let pemKey;
let domain;

function setEnvironment(config) {
  REGISTRY = config.registryAddress;
  etherPrivateKey = config.privateKey;
  jsonRpcUrl = config.rpcUrl;
}

export function setup() {
  console.log('Running Setup...');

  certPath = '/../ssl/certs/cert.pem';
  cert = readFileSync(__dirname + certPath, 'utf8');
  intermediateCertPath = '/../ssl/certs/intermediateCert.pem';
  intermediateCert = readFileSync(__dirname + intermediateCertPath, 'utf8');
  chain = [cert, intermediateCert];
  pemKeyPath = '/../ssl/private/privKey.pem';
  pemKey = readFileSync(__dirname + pemKeyPath, 'utf8');
  domain = 'tls-did.de';

  setEnvironment(localEnv);

  console.log('REGISTRY:', REGISTRY);
  console.log('Ethereum private key:', etherPrivateKey);
  console.log('Json Rpc Url:', jsonRpcUrl);
  console.log('TLS pem key: \n', `${pemKey.substring(0, 64)}...`);
}

//createTLSDID creates a new TLS-DID onchain and a corresponding TLS-DID js object.
//If valid == false the expiry is set to
async function createTLSDID(valid) {
  //Setup TLS-DID object
  const tlsDid = new TLSDID(etherPrivateKey, {
    registry: REGISTRY,
    providerConfig: {
      rpcUrl: jsonRpcUrl,
    },
  });

  //Deploy TLS-DID contract to ethereum blockchain
  console.log('Deploying contract....');
  await tlsDid.deployContract();
  console.log('Contract address:', tlsDid.getAddress());

  //Register TLS-DID contract with domain as key in registry contract
  console.log('Registering contract with domain:', domain);
  await tlsDid.registerContract(domain, pemKey);

  //Register TLS pem cert chain
  //Registering is needed for the full chain except the root certificate
  console.log(
    'Adding cert chain:',
    chain.map((cert) => `${cert.substring(0, 64)}...`)
  );
  await tlsDid.addChain(chain, pemKey);

  //Add attributes to DID Document (path, value)
  console.log('Adding example attribute to DID Document');
  //Adds {parent: {child: value}}
  await tlsDid.addAttribute('parent/child', 'value', pemKey);
  //Adds {array: [{element: value}]}
  await tlsDid.addAttribute('arrayA[0]/element', 'value', pemKey);
  //Adds {array: [value]}
  await tlsDid.addAttribute('arrayB[0]', 'value', pemKey);
  //Add assertionMethod to DID Document
  console.log('Adding assertionMethod to DID Document');
  await tlsDid.addAttribute('assertionMethod[0]/id', 'did:example:123456789abcdefghi#keys-2', pemKey);
  await tlsDid.addAttribute('assertionMethod[0]/type', 'Ed25519VerificationKey2018', pemKey);
  await tlsDid.addAttribute('assertionMethod[0]/controller', 'did:example:123456789abcdefghi', pemKey);
  await tlsDid.addAttribute('assertionMethod[0]/publicKeyBase58', 'H3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV', pemKey);

  //Add expiry to TLS-DID contract
  console.log('Setting expiry');
  await tlsDid.setExpiry(new Date('2040/12/12'), pemKey);

  //Setting wrong signature for worst case resolver time
  if (!valid) {
    const mTlsDid = new MaliciousTLSDID(etherPrivateKey, {
      registry: REGISTRY,
      providerConfig: {
        rpcUrl: jsonRpcUrl,
      },
    });
    await mTlsDid.connectToContract(tlsDid.getAddress());
    await mTlsDid.setSignature('xxx');
  }

  return tlsDid;
}

export async function createTLSDIDsAndResolve(numberOfContracts) {
  //Setup resolver
  console.log('Resolving DID Document for did:', `did:tls:${domain}`);
  const tlsResolver = getResolver(
    {
      rpcUrl: jsonRpcUrl,
    },
    REGISTRY,
    rootCertificates
  );
  const resolver = new Resolver({ ...tlsResolver });

  //Setup empty tlsDid array and initial valid contract
  let tlsDids = Array.from(Array(numberOfContracts));
  tlsDids[0] = await createTLSDID(true);

  let ts = [];
  for (let i = 0; i < tlsDids.length; i++) {
    //Resolve DID Document
    const t0 = performance.now();

    try {
      const didDocument = await resolver.resolve(`did:tls:${domain}`);
      console.log('DID Document:', didDocument);
    } catch (err) {
      console.error('Error while resolving did.', err.message);
    }

    const t1 = performance.now();
    console.log('Resolving DID took ' + (t1 - t0) + ' milliseconds.');
    ts[i] = t1 - t0;

    if (i + 1 < tlsDids.length) {
      tlsDids[i + 1] = await createTLSDID(false);
    }
  }
  console.log(ts);

  //Delete TLS-DID
  console.log('Deleting TLS-DID');
  for (let i = 0; i < tlsDids.length; i++) {
    await tlsDids[i].delete();
  }

  return ts;
}
