import { Permission } from '@sharkord/shared';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { getChannel } from '../../db/queries/channels/get-channel';
import { protectedProcedure } from '../../utils/trpc';

const getChannelRoute = protectedProcedure
  .input(
    z.object({
      channelId: z.number().min(1)
    })
  )
  .query(async ({ input, ctx }) => {
    await ctx.needsPermission(Permission.MANAGE_CHANNELS);

    const channel = await getChannel(input.channelId);

    if (!channel) {
      throw new TRPCError({
        code: 'NOT_FOUND'
      });
    }

    return channel;
  });

export { getChannelRoute };
