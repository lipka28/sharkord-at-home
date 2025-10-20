import type { TEmoji } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { db } from '../..';
import { emojis } from '../../schema';

const removeEmoji = async (id: number): Promise<TEmoji | undefined> =>
  db.delete(emojis).where(eq(emojis.id, id)).returning().get();

export { removeEmoji };
