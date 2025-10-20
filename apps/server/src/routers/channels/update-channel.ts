import { ServerEvents } from '@sharkord/shared';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { updateChannel } from '../../db/mutations/channels/update-channel';
import { protectedProcedure } from '../../utils/trpc';

const updateChannelRoute = protectedProcedure
  .input(
    z.object({
      channelId: z.number().min(1),
      name: z.string().min(2).max(24),
      topic: z.string().max(128).nullable()
    })
  )
  .mutation(async ({ ctx, input }) => {
    const updatedChannel = await updateChannel(input.channelId, {
      name: input.name,
      topic: input.topic
    });

    if (!updatedChannel) {
      throw new TRPCError({
        code: 'NOT_FOUND'
      });
    }

    ctx.pubsub.publish(ServerEvents.CHANNEL_UPDATE, updatedChannel);
  });

export { updateChannelRoute };
