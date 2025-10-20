import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { fileManager } from '../../utils/file-manager.js';
import { protectedProcedure } from '../../utils/trpc.js';

const deleteTemporaryFileRoute = protectedProcedure
  .input(z.object({ fileId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const temporaryFile = fileManager.getTemporaryFile(input.fileId);

    if (!temporaryFile) {
      throw new TRPCError({
        code: 'NOT_FOUND'
      });
    }

    const isOwnUserFile = temporaryFile.userId === ctx.user.id;

    if (!isOwnUserFile) {
      throw new TRPCError({
        code: 'FORBIDDEN'
      });
    }

    await fileManager.removeTemporaryFile(input.fileId);
  });

export { deleteTemporaryFileRoute };
