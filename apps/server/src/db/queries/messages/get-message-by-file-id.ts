import type { TMessage } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { db } from '../..';
import { messageFiles, messages } from '../../schema';

const getMessageByFileId = async (
  fileId: number
): Promise<TMessage | undefined> => {
  const row = await db
    .select({ message: messages })
    .from(messageFiles)
    .innerJoin(messages, eq(messages.id, messageFiles.messageId))
    .where(eq(messageFiles.fileId, fileId))
    .get();

  return row?.message;
};

export { getMessageByFileId };
