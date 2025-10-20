import { db } from '../..';
import { messageReactions } from '../../schema';

const addReaction = async (messageId: number, emoji: string, userId: number) =>
  db.insert(messageReactions).values({
    messageId,
    emoji,
    createdAt: Date.now(),
    userId,
    fileId: null
  });

export { addReaction };
