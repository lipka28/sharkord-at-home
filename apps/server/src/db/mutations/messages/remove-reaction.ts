import { and, eq } from 'drizzle-orm';
import { db } from '../..';
import { messageReactions } from '../../schema';

const removeReaction = async (
  messageId: number,
  emoji: string,
  userId: number
) =>
  db
    .delete(messageReactions)
    .where(
      and(
        eq(messageReactions.messageId, messageId),
        eq(messageReactions.emoji, emoji),
        eq(messageReactions.userId, userId)
      )
    );

export { removeReaction };
