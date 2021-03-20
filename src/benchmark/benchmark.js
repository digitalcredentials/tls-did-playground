import { setup, createTLSDIDsAndResolve } from './tlsdid';
import { saveToFile } from '../../helpers/saveBenchmark';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

setup();
const privateKeys = [
  '0x96eb3ae3f929d808d61b8b19ac3d4456834d19a07d3d09c0e7b31eca828af6a9',
  '0xc5aea55f87a4ac6dd2d030012d0c46a76e4c64e9bcea7194b3abd72cc4d4d73a',
  '0x547bb9d0a10c7ed1988f6180f6e191e999b9e6e16314fa69271a667b99cdca1b',
  '0x70b096141e49191a1986d30e4bb4e8dff29b3994bd1d804cda0ab2979ccda258',
  '0xfcd5fea1c4201a8ca91366f49c8c5c61524c969cb1b0d6dc6d62e538439b4764',
  '0xdc9d97047a48bba07a5671841fd0e1143a8c56b914452f9834a4775b58c93293',
  '0x0109dd86311b88812d8d740ed776fe02ab05a26ebdcfb52b1b6989b1d5c9636c',
  '0xe57d62a92a26b405d6349cca5c8855d0043295d755546c1a003a5a9d9e97cff1',
  '0x5b68951482c4d815d6e04bda1f23aa24411e2db5206efeeaa80d4805fc5361e9',
];
const ts = await createTLSDIDsAndResolve(privateKeys);
saveToFile('t1', ts, `${__dirname}/benchmark.json`);
