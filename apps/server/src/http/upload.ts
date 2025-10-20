import { UploadHeaders } from '@sharkord/shared';
import fs from 'fs';
import http from 'http';
import { getUserByToken } from '../db/queries/users/get-user-by-token';
import { logger } from '../logger';
import { fileManager } from '../utils/file-manager';

const uploadFileRouteHandler = async (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => {
  const token = String(req.headers[UploadHeaders.TOKEN]);
  const originalName = String(req.headers[UploadHeaders.ORIGINAL_NAME]);
  const contentLength = Number(req.headers[UploadHeaders.CONTENT_LENGTH]);

  const user = await getUserByToken(token);

  if (!user) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized' }));
    return;
  }

  const safePath = await fileManager.getSafeUploadPath(originalName);

  logger.debug(
    'Uploading file: %s (%d bytes) from %s',
    originalName,
    contentLength,
    user.name
  );

  const fileStream = fs.createWriteStream(safePath);

  req.pipe(fileStream);

  fileStream.on('finish', async () => {
    try {
      const tempFile = await fileManager.addTemporaryFile({
        originalName,
        filePath: safePath,
        size: contentLength,
        userId: user.id
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(tempFile));
    } catch (error) {
      logger.error('Error processing uploaded file:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'File processing failed' }));
    }
  });

  fileStream.on('error', (err) => {
    logger.error('Error uploading file:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'File upload failed' }));
  });
};

export { uploadFileRouteHandler };
