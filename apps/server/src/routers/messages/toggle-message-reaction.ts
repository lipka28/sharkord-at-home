import { Permission } from '@sharkord/shared';
import { z } from 'zod';
import { addReaction } from '../../db/mutations/messages/add-reaction';
import { removeReaction } from '../../db/mutations/messages/remove-reaction';
import { publishMessageUpdate } from '../../db/publishers';
import { getReaction } from '../../db/queries/messages/get-reaction';
import { protectedProcedure } from '../../utils/trpc';

const toggleMessageReactionRoute = protectedProcedure
  .input(
    z.object({
      messageId: z.number(),
      emoji: z.string()
    })
  )
  .mutation(async ({ input, ctx }) => {
    await ctx.needsPermission(Permission.REACT_TO_MESSAGES);

    const reaction = await getReaction(
      input.messageId,
      input.emoji,
      ctx.user.id
    );

    if (!reaction) {
      await addReaction(input.messageId, input.emoji, ctx.user.id);
    } else {
      await removeReaction(input.messageId, input.emoji, ctx.user.id);
    }

    await publishMessageUpdate(input.messageId);
  });

export { toggleMessageReactionRoute };
