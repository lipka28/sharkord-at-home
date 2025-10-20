// since we rely on Bun to automatically bundle the interface zip file in production, when
// running in development we need to ensure that the file exists to avoid runtime errors
// this will be all removed once Bun is stable enough

import fs from 'fs/promises';
import path from 'path';

const buildTempPath = path.join(__dirname, 'temp');

if (!(await fs.exists(buildTempPath))) {
  await fs.mkdir(buildTempPath, { recursive: true });
}

const interfaceZipPath = path.join(buildTempPath, 'interface.zip');

if (!(await fs.exists(interfaceZipPath))) {
  await fs.writeFile(interfaceZipPath, '');
}
