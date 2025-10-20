import { eq } from 'drizzle-orm';
import { db } from '../..';
import { emojis } from '../../schema';

const emojiExists = async (name: string): Promise<boolean> => {
  const emoji = await db
    .select()
    .from(emojis)
    .where(eq(emojis.name, name))
    .limit(1)
    .get();

  return !!emoji;
};

export { emojiExists };
