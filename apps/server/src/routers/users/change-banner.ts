import { TRPCError } from '@trpc/server';
import z from 'zod';
import { removeFile } from '../../db/mutations/files/remove-file';
import { updateUser } from '../../db/mutations/users/update-user';
import { publishUser } from '../../db/publishers';
import { getUserById } from '../../db/queries/users/get-user-by-id';
import { fileManager } from '../../utils/file-manager';
import { protectedProcedure } from '../../utils/trpc';

const changeBannerRoute = protectedProcedure
  .input(
    z.object({
      fileId: z.string().optional()
    })
  )
  .mutation(async ({ ctx, input }) => {
    const user = await getUserById(ctx.userId);

    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    if (user.bannerId) {
      await removeFile(user.bannerId);
      await updateUser(ctx.userId, { bannerId: null });
    }

    if (input.fileId) {
      const newFile = await fileManager.saveFile(input.fileId, ctx.userId);

      await updateUser(ctx.userId, { bannerId: newFile.id });
    }

    await publishUser(ctx.userId, 'update');
  });

export { changeBannerRoute };
