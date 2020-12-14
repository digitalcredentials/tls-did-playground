import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

const registryPath = '../tls-did-registry';

execSync(`npm run deploy-registry --prefix ${registryPath}`, {
  stdio: 'inherit',
});

const readData = readFileSync(`${registryPath}/helpers/contractRegistry.json`);

const contractRegistry = JSON.parse(readData);

storeAddress('registryAddress', contractRegistry.registryAddress);

function storeAddress(key, address) {
  const readData = readFileSync('environment.json', 'utf8');
  let environment = JSON.parse(readData);

  environment[key] = address;

  const writeData = JSON.stringify(environment);
  writeFileSync('environment.json', writeData);
}
