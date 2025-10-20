import fs from 'fs/promises';
import path from 'path';
import { zipDirectory } from '../src/helpers/zip';

const clientCwd = path.resolve(process.cwd(), '..', 'client');
const serverCwd = process.cwd();
const viteDistPath = path.join(clientCwd, 'dist');
const buildPath = path.join(serverCwd, 'build');
const buildTempPath = path.join(buildPath, 'temp');
const drizzleMigrationsPath = path.join(serverCwd, 'src', 'db', 'migrations');
const outPath = path.join(buildPath, 'out');
const interfaceZipPath = path.join(buildTempPath, 'interface.zip');
const drizzleZipPath = path.join(buildTempPath, 'drizzle.zip');

await fs.rm(buildTempPath, { recursive: true, force: true });
await fs.mkdir(buildTempPath, { recursive: true });

console.log('Building client with Vite...');

const viteProc = Bun.spawn(['bun', 'run', 'build'], {
  cwd: clientCwd,
  stdout: 'inherit',
  stderr: 'inherit',
  stdin: 'inherit'
});
await viteProc.exited;

if (viteProc.exitCode !== 0) {
  console.error('Client build failed');
  process.exit(viteProc.exitCode);
}

console.log('Client build finished, output at:', viteDistPath);
console.log('Creating interface.zip...');

await zipDirectory(viteDistPath, interfaceZipPath);

console.log('Creating drizzle.zip...');

await zipDirectory(drizzleMigrationsPath, drizzleZipPath);

console.log('Compiling server with Bun...');

await Bun.build({
  entrypoints: [
    './src/index.ts',
    './build/temp/drizzle.zip',
    './build/temp/interface.zip'
  ],
  compile: {
    outfile: path.join(outPath, 'sharkord')
  },
  define: {
    SHARKORD_ENV: '"production"',
    SHARKORD_BUILD_VERSION: '"1.1.1"',
    SHARKORD_BUILD_DATE: `"${new Date().toISOString()}"`
  }
});

await fs.rm(buildTempPath, { recursive: true, force: true });

console.log('Sharkord built.');
