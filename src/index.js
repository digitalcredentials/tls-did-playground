import { rootCertificates } from 'tls';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { TLSDID } from 'tls-did';
import { getResolver } from 'tls-did-resolver';
import environment from '../environment.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Registry address has to be updated to registry contract address
//For testing we use ganache-cli
console.log('Example TLSDID flow');

//To deploy registry: npm run deploy @tls-did-registry
const REGISTRY = environment.registryAddress;
console.log('REGISTRY:', REGISTRY);

//Private ethereum key to create / register / updated tls did contract
const etherPrivateKey = environment.privateKey;
console.log('Ethereum private key:', etherPrivateKey);

//Setup ethereum provider
const jsonRpcUrl = 'http://localhost:8545';
console.log('Json Rpc Url:', jsonRpcUrl);

//Private tls key for signing
const pemKeyPath = '/ssl/private/privKey.pem';
const pemKey = readFileSync(__dirname + pemKeyPath, 'utf8');
console.log('TLS pem key: \n', `${pemKey.substring(0, 64)}...`);

//Setup TLSDID object
const tlsDid = new TLSDID(etherPrivateKey, {
  registry: REGISTRY,
  providerConfig: {
    rpcUrl: jsonRpcUrl,
  },
});

//Deploy tls DID contract to ethereum blockchain
console.log('Deploying contract....');
await tlsDid.deployContract();
console.log('Contract address:', tlsDid.getAddress());

//Register TLS DID contract with domain as key to ethereum blockchain
//We randomly generate the domain to avoid multiple valid contracts
//for the same domain during one test session
const domain = 'tls-did.de';
console.log('Registering contract with domain:', domain);
await tlsDid.registerContract(domain, pemKey);

//Register TLS pem cert chain
//Registering is needed for the full chain exept the root certificate
const certPath = '/ssl/certs/cert.pem';
const cert = readFileSync(__dirname + certPath, 'utf8');
const intermediateCertPath = '/ssl/certs/intermediateCert.pem';
const intermediateCert = readFileSync(__dirname + intermediateCertPath, 'utf8');
const chain = [cert, intermediateCert];
console.log(
  'Adding cert chain:',
  chain.map((cert) => `${cert.substring(0, 64)}...`)
);
await tlsDid.addChain(chain, pemKey);

//Add attributea to DID Document (path, value)
console.log('Adding example attribute to DID Document');
//Adds {parent: {child: value}}
await tlsDid.addAttribute('parent/child', 'value', pemKey);
//Adds {array: [{element: value}]}
await tlsDid.addAttribute('arrayA[]/element', 'value', pemKey);
//Adds {array: [value]}
await tlsDid.addAttribute('arrayB[]', 'value', pemKey);

//Add expiry to tls DID contract
console.log('Setting expiry');
await tlsDid.setExpiry(new Date('2040/12/12'), pemKey);

//Resolve DID Document
console.log('Resolving DID Document for did:', `did:tls:${domain}`);
const resolver = getResolver(
  {
    rpcUrl: jsonRpcUrl,
  },
  REGISTRY,
  rootCertificates
);
try {
  const didDocument = await resolver.tls(`did:tls:${domain}`);
  console.log('DID Document:', didDocument);
} catch (err) {
  console.error('Error while resolving did.', err.message);
}
