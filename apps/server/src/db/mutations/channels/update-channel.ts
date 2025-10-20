import type { TChannel, TIChannel } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { db } from '../..';
import { channels } from '../../schema';

const updateChannel = async (
  channelId: number,
  channel: Partial<TIChannel>
): Promise<TChannel | undefined> =>
  db
    .update(channels)
    .set({
      ...channel,
      updatedAt: Date.now()
    })
    .where(eq(channels.id, channelId))
    .returning()
    .get();

export { updateChannel };
