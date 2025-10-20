import { db } from '../..';
import { messageFiles } from '../../schema';

const addFileMessageRelation = async (messageId: number, fileId: number) =>
  db.insert(messageFiles).values({
    messageId,
    fileId,
    createdAt: Date.now()
  });

export { addFileMessageRelation };
