import { eq } from 'drizzle-orm';
import { db } from '../..';
import { messages } from '../../schema';

const messageExists = async (messageId: number): Promise<boolean> => {
  const message = await db
    .select({
      id: messages.id
    })
    .from(messages)
    .where(eq(messages.id, messageId))
    .limit(1)
    .get();

  return !!message;
};

export { messageExists };
