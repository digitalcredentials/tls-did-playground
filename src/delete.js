import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { TLSDID } from '@digitalcredentials/tls-did';
import localConfig from '../environment.json';
import publicConfig from '../publicEnv.json';

//To start the testnet: npm run testnet
//To deploy registry: npm run deployRegistry

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Registry address has to be updated to registry contract address
//For testing we use ganache-cli
console.log('Example TLS-DID flow');

let REGISTRY;
let jsonRpcUrl;
let etherPrivateKey;
//setEnvironment reads the config file an sets local constants
function setEnvironment(local) {
  let config;
  if (local) {
    config = localConfig;
    REGISTRY = config.registryAddress;
  } else {
    config = publicConfig;
  }

  etherPrivateKey = config.privateKey;
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

//Private ethereum key to create / register / updated TLS-DID contract
console.log('Ethereum private key:', etherPrivateKey);

//Setup ethereum provider
console.log('Json Rpc Url:', jsonRpcUrl);
//Setup TLS-DID object
const domain = 'tls-did.de';
const tlsDid = new TLSDID(domain, etherPrivateKey, {
  registry: REGISTRY,
  providerConfig: {
    rpcUrl: jsonRpcUrl,
  },
});

//Load data from registry, sets among others `isRegistered` to true if claim can be found
console.log('Load claim data from registry, if existent');
await tlsDid.loadDataFromRegistry();
console.log('Is registered:', tlsDid.registered);

//Delete TLS-DID
console.log('Deleting TLS-DID');
await tlsDid.delete();
