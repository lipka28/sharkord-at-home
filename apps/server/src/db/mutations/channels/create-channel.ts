import type { TChannel, TIChannel } from '@sharkord/shared';
import { desc, eq } from 'drizzle-orm';
import { db } from '../..';
import { channels } from '../../schema';

const createChannel = async (
  channel: Omit<TIChannel, 'createdAt' | 'position'>
): Promise<TChannel> => {
  const maxPositionChannel = await db
    .select()
    .from(channels)
    .orderBy(desc(channels.position))
    .where(eq(channels.categoryId, channel.categoryId!))
    .limit(1)
    .get();

  return db
    .insert(channels)
    .values({
      ...channel,
      position: maxPositionChannel?.position
        ? maxPositionChannel.position + 1
        : 0,
      createdAt: Date.now()
    })
    .returning()
    .get();
};

export { createChannel };
