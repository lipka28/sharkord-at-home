import fs from 'fs';
import http from 'http';
import path from 'path';
import { INTERFACE_PATH } from '../helpers/paths';
import { logger } from '../logger';
import { IS_DEVELOPMENT } from '../utils/env';

const interfaceRouteHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => {
  if (IS_DEVELOPMENT) {
    res.writeHead(302, { Location: 'http://localhost:5173' });
    res.end();
    return res;
  }

  let subPath = req.url || '/';

  const urlPart = subPath.split('?')[0];
  subPath = urlPart ? decodeURIComponent(urlPart) : '/';
  subPath = subPath === '/' ? 'index.html' : subPath;

  const requestedPath = path.resolve(INTERFACE_PATH, subPath);
  const basePath = path.resolve(INTERFACE_PATH);

  if (!requestedPath.startsWith(basePath)) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Forbidden' }));
    return res;
  }

  if (!fs.existsSync(requestedPath)) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return res;
  }

  const file = Bun.file(requestedPath);
  const fileStream = fs.createReadStream(requestedPath);

  fileStream.on('open', () => {
    res.writeHead(200, {
      'Content-Type': file.type,
      'Content-Length': file.size
    });
    fileStream.pipe(res);
  });

  fileStream.on('error', (err) => {
    logger.error('Error serving file:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    } else {
      res.destroy();
    }
  });

  res.on('close', () => {
    fileStream.destroy();
  });

  return res;
};

export { interfaceRouteHandler };
