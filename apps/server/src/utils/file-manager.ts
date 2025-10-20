import type { TFile, TTempFile } from '@sharkord/shared';
import { randomUUIDv7 } from 'bun';
import { createHash } from 'crypto';
import { parse } from 'file-type-mime';
import fs from 'fs/promises';
import path from 'path';
import { createFile } from '../db/mutations/files/create-file';
import { getUniqueFileId } from '../db/mutations/files/get-unique-file-id';
import { PUBLIC_PATH, TMP_PATH, UPLOADS_PATH } from '../helpers/paths';

const TEMP_FILE_TTL = 1000 * 60 * 1; // 1 minute

const md5File = async (path: string): Promise<string> => {
  const file = await fs.readFile(path);
  const hash = createHash('md5');

  hash.update(file);

  return hash.digest('hex');
};

class TemporaryFileManager {
  private temporaryFiles: TTempFile[] = [];
  private timeouts: {
    [id: string]: NodeJS.Timeout;
  } = {};

  private getUniqueId = async (): Promise<number> => getUniqueFileId();

  public getTemporaryFile = (id: string): TTempFile | undefined => {
    return this.temporaryFiles.find((file) => file.id === id);
  };

  public temporaryFileExists = (id: string): boolean => {
    return !!this.temporaryFiles.find((file) => file.id === id);
  };

  public addTemporaryFile = async ({
    filePath,
    size,
    originalName,
    userId
  }: {
    filePath: string;
    size: number;
    originalName: string;
    userId: number;
  }): Promise<TTempFile> => {
    const md5 = await md5File(filePath);
    const fileId = randomUUIDv7();
    const ext = path.extname(originalName);

    const tempFilePath = path.join(TMP_PATH, `${fileId}${ext}`);

    const tempFile: TTempFile = {
      id: fileId,
      originalName,
      size,
      md5,
      path: tempFilePath,
      extension: ext,
      userId
    };

    await fs.rename(filePath, tempFile.path);

    this.temporaryFiles.push(tempFile);

    this.timeouts[tempFile.id] = setTimeout(() => {
      this.removeTemporaryFile(tempFile.id);
    }, TEMP_FILE_TTL);

    return tempFile;
  };

  public removeTemporaryFile = async (id: string): Promise<void> => {
    const tempFile = this.temporaryFiles.find((file) => file.id === id);

    if (tempFile) {
      clearTimeout(this.timeouts[id]);

      try {
        await fs.unlink(tempFile.path);
      } catch {
        // ignore
      }

      this.temporaryFiles = this.temporaryFiles.filter(
        (file) => file.id !== id
      );
    }
  };

  public getSafeUploadPath = async (name: string): Promise<string> => {
    const ext = path.extname(name);
    const safePath = path.join(
      UPLOADS_PATH,
      `${await this.getUniqueId()}${ext}`
    );

    return safePath;
  };
}

class FileManager {
  private tempFileManager = new TemporaryFileManager();

  public getSafeUploadPath = this.tempFileManager.getSafeUploadPath;

  public addTemporaryFile = this.tempFileManager.addTemporaryFile;

  public removeTemporaryFile = this.tempFileManager.removeTemporaryFile;

  public getTemporaryFile = this.tempFileManager.getTemporaryFile;

  public async saveFile(tempFileId: string, userId: number): Promise<TFile> {
    const tempFile = this.getTemporaryFile(tempFileId);

    if (!tempFile) {
      throw new Error('File not found');
    }

    if (tempFile.userId !== userId) {
      throw new Error("You don't have permission to access this file");
    }

    const nextId = await getUniqueFileId();
    const fileName = `${nextId}${tempFile.extension}`;
    const destinationPath = path.join(PUBLIC_PATH, fileName);

    await fs.rename(tempFile.path, destinationPath);

    const arrayBuffer = await fs.readFile(destinationPath);
    const mimeResult = parse(new Uint8Array(arrayBuffer).buffer);

    return createFile({
      name: fileName,
      extension: tempFile.extension,
      md5: tempFile.md5,
      size: tempFile.size,
      originalName: tempFile.originalName,
      userId,
      mimeType: mimeResult?.mime || 'application/octet-stream',
      createdAt: Date.now()
    });
  }
}

const fileManager = new FileManager();

export { fileManager };
