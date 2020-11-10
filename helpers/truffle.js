import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

const test = execSync(`npm run deploy-registry --prefix ../tls-did-registry`, {
  stdio: 'inherit',
});

const readData = readFileSync(
  '../tls-did-registry/helpers/contractRegistry.json'
);

const contractRegistry = JSON.parse(readData);

storeAddress(contractRegistry.registryAddress);

function storeAddress(address) {
  const readData = readFileSync('environment.json', 'utf8');
  let environment = JSON.parse(readData);

  environment.registryAddress = address;

  const writeData = JSON.stringify(environment);
  console.log('write', writeData);
  writeFileSync('environment.json', writeData);
}
