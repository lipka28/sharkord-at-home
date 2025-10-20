import type { TEmoji } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { db } from '../..';
import { emojis } from '../../schema';

const updateEmoji = async (
  id: number,
  updates: Partial<Pick<TEmoji, 'name' | 'updatedAt'>>
): Promise<TEmoji | undefined> =>
  db
    .update(emojis)
    .set({
      ...updates,
      updatedAt: Date.now()
    })
    .where(eq(emojis.id, id))
    .returning()
    .get();

export { updateEmoji };
