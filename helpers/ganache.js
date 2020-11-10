import environment from '../environment.json';
import { execSync } from 'child_process';

execSync(
  `ganache-cli --account '${environment.privateKey}, 100000000000000000000'`,
  {
    stdio: 'inherit',
  }
);
