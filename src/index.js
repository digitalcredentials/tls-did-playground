// Example tls-did creation and resolving
import { readFileSync } from 'fs';
import { providers } from 'ethers';
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
const provider = new providers.JsonRpcProvider(jsonRpcUrl);
console.log('Json Rpc Url:', jsonRpcUrl);

//Private tls key for signing
const pemKeyPath = '/ssl/private/testserver.pem';
const pemKey = readFileSync(__dirname + pemKeyPath, 'utf8');
console.log('TLS pem key: \n', `${pemKey.substring(0, 64)}...`);

//Setup TLSDID object
const tlsDid = new TLSDID(pemKey, etherPrivateKey, REGISTRY, {
  provider,
});

//Deploy tls DID contract to ethereum blockchain
console.log('Deploying contract....');
await tlsDid.deployContract();
console.log('Contract address:', tlsDid.getAddress());

//Register tls DID contract with domain as key to ethereum blockchain
//We randomly generate the domain to avoid multiple valid contracts
//for the same domain during one test session
const random = Math.random().toString(36).substring(7);
const domain = `example-${random}.org`;
console.log('Registering contract with domain:', domain);
await tlsDid.registerContract(domain);

//Add attribute to DID Document (path, value)
console.log('Adding example attribute to DID Document');
await tlsDid.addAttribute('parent/child', 'value');

//Add expiry to tls DID contract
console.log('Setting expiry');
await tlsDid.setExpiry(new Date('2040/12/12'));

//Resolve DID Document
console.log('Resolving DID Document for did:', `did:tls:${domain}`);
const resolver = getResolver(provider, REGISTRY);
const didDocument = await resolver.tls(`did:tls:${domain}`);
console.log('DID Document:', didDocument);