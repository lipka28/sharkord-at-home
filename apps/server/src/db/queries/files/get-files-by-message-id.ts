import type { TFile } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { db } from '../..';
import { files, messageFiles } from '../../schema';

const getFilesByMessageId = async (messageId: number): Promise<TFile[]> =>
  db
    .select()
    .from(messageFiles)
    .innerJoin(files, eq(messageFiles.fileId, files.id))
    .where(eq(messageFiles.messageId, messageId))
    .all()
    .map((row) => row.files);

export { getFilesByMessageId };
