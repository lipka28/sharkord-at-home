import path from 'path';
import { ensureDir } from './fs';
import * as serverPaths from './paths';

const pathsList = Object.values(serverPaths);

const promises = pathsList.map(async (dir) => {
  const resolvedPath = path.resolve(process.cwd(), dir);
  const extension = path.extname(resolvedPath);

  if (extension) return;

  await ensureDir(resolvedPath);
});

await Promise.all(promises);
