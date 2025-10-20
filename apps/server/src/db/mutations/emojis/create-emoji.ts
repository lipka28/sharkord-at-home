import type { TEmoji, TIEmoji } from '@sharkord/shared';
import { db } from '../..';
import { emojis } from '../../schema';

const createEmoji = async (emoji: TIEmoji): Promise<TEmoji | undefined> =>
  db
    .insert(emojis)
    .values({
      name: emoji.name,
      fileId: emoji.fileId,
      userId: emoji.userId,
      createdAt: emoji.createdAt
    })
    .returning()
    .get();

export { createEmoji };
