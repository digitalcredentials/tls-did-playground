import { rootCertificates } from 'tls';
import { fileURLToPath } from 'url';
import { getResolver } from '@digitalcredentials/tls-did-resolver';
import { Resolver } from 'did-resolver';
import localConfig from '../environment.json';
import publicConfig from '../publicEnv.json';

//To start the testnet: npm run testnet
//To deploy registry: npm run deployRegistry

const __filename = fileURLToPath(import.meta.url);

const domain = 'tls-did.de';
let REGISTRY;
let jsonRpcUrl;

//setEnvironment reads the config file an sets local constants
function setEnvironment(local) {
  let config;
  if (local) {
    config = localConfig;
    REGISTRY = config.registryAddress;
  } else {
    config = publicConfig;
  }
  jsonRpcUrl = config.rpcUrl;
}

//Sets test environment
setEnvironment(false);

//Address of registry contract on local or public testnet
if (REGISTRY) {
  console.log('Registry address:', REGISTRY);
} else {
  console.log('Using registry address stored in tls-did-utils');
}

//Setup ethereum provider
console.log('Json Rpc Url:', jsonRpcUrl);

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

//Resolve DID Document
try {
  const didDocument = await resolver.resolve(`did:tls:${domain}`);
  console.log('DID Document:', didDocument);
} catch (err) {
  console.error('Error while resolving did.', err.data);
}
