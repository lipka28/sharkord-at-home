import { ChannelType, Permission, ServerEvents } from '@sharkord/shared';
import { z } from 'zod';
import { createChannel } from '../../db/mutations/channels/create-channel';
import { protectedProcedure } from '../../utils/trpc';

const addChannelRoute = protectedProcedure
  .input(
    z.object({
      type: z.enum(ChannelType),
      name: z.string().min(1).max(16),
      categoryId: z.number()
    })
  )
  .mutation(async ({ input, ctx }) => {
    await ctx.needsPermission(Permission.MANAGE_CHANNELS);

    const channel = await createChannel({
      name: input.name,
      type: input.type,
      categoryId: input.categoryId
    });

    ctx.pubsub.publish(ServerEvents.CHANNEL_CREATE, channel);
  });

export { addChannelRoute };
