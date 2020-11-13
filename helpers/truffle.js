import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

const registryPath = '../tls-did-registry';

const test = execSync(`npm run deploy-registry --prefix ${registryPath}`, {
  stdio: 'inherit',
});

const readData = readFileSync(`${registryPath}/helpers/contractRegistry.json`);

const contractRegistry = JSON.parse(readData);

storeAddress(contractRegistry.registryAddress);

function storeAddress(address) {
  const readData = readFileSync('environment.json', 'utf8');
  let environment = JSON.parse(readData);

  environment.registryAddress = address;

  const writeData = JSON.stringify(environment);
  writeFileSync('environment.json', writeData);
}
