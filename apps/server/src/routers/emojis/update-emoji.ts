import { Permission } from '@sharkord/shared';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { updateEmoji } from '../../db/mutations/emojis/update-emoji';
import { publishEmojiUpdate } from '../../db/publishers';
import { protectedProcedure } from '../../utils/trpc';

const updateEmojiRoute = protectedProcedure
  .input(
    z.object({
      emojiId: z.number().min(1),
      name: z.string().min(1).max(24)
    })
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.needsPermission(Permission.MANAGE_EMOJIS);

    const updatedEmoji = await updateEmoji(input.emojiId, {
      name: input.name
    });

    if (!updatedEmoji) {
      throw new TRPCError({
        code: 'NOT_FOUND'
      });
    }

    await publishEmojiUpdate(updatedEmoji.id);
  });

export { updateEmojiRoute };
