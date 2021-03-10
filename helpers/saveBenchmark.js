import { readFileSync, writeFileSync } from 'fs';

export function saveToFile(key, value, filePath) {
  const readData = readFileSync(filePath, 'utf8');
  let environment = JSON.parse(readData);

  environment[key] = value;

  const writeData = JSON.stringify(environment);
  writeFileSync(filePath, writeData);
}
