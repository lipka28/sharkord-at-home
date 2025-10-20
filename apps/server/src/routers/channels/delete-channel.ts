import { Permission, ServerEvents } from '@sharkord/shared';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { removeChannel } from '../../db/mutations/channels/remove-channel';
import { protectedProcedure } from '../../utils/trpc';

const deleteChannelRoute = protectedProcedure
  .input(
    z.object({
      channelId: z.number()
    })
  )
  .mutation(async ({ input, ctx }) => {
    await ctx.needsPermission(Permission.MANAGE_CHANNELS);

    const removedChannel = await removeChannel(input.channelId);

    if (!removedChannel) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    ctx.pubsub.publish(ServerEvents.CHANNEL_DELETE, removedChannel.id);
  });

export { deleteChannelRoute };
