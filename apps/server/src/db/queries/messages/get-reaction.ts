import type { TMessageReaction } from '@sharkord/shared';
import { and, eq } from 'drizzle-orm';
import { db } from '../..';
import { messageReactions } from '../../schema';

const getReaction = async (
  messageId: number,
  emoji: string,
  userId: number
): Promise<TMessageReaction | undefined> =>
  db
    .select()
    .from(messageReactions)
    .where(
      and(
        eq(messageReactions.messageId, messageId),
        eq(messageReactions.emoji, emoji),
        eq(messageReactions.userId, userId)
      )
    )
    .get();

export { getReaction };
