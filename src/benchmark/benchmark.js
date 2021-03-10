import { setup, createTLSDIDsAndResolve } from './tlsdid';
import { saveToFile } from '../../helpers/saveBenchmark';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

setup();
const ts = await createTLSDIDsAndResolve(100);
saveToFile('t1', ts, `${__dirname}/benchmark.json`);
