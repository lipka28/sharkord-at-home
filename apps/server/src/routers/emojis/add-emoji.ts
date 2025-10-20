import { Permission } from '@sharkord/shared';
import { z } from 'zod';
import { createEmoji } from '../../db/mutations/emojis/create-emoji';
import { getUniqueEmojiName } from '../../db/mutations/emojis/get-unique-emoji-name';
import { publishEmojiCreate } from '../../db/publishers';
import { fileManager } from '../../utils/file-manager';
import { protectedProcedure } from '../../utils/trpc';

const addEmojiRoute = protectedProcedure
  .input(
    z.array(
      z.object({
        fileId: z.string(),
        name: z.string().min(1).max(32)
      })
    )
  )
  .mutation(async ({ input, ctx }) => {
    await ctx.needsPermission(Permission.MANAGE_EMOJIS);

    for (const data of input) {
      const newFile = await fileManager.saveFile(data.fileId, ctx.userId);
      const uniqueEmojiName = await getUniqueEmojiName(data.name);

      const emoji = await createEmoji({
        name: uniqueEmojiName,
        userId: ctx.userId,
        fileId: newFile.id,
        createdAt: Date.now()
      });

      await publishEmojiCreate(emoji?.id);
    }
  });

export { addEmojiRoute };
