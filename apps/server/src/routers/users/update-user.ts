import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { updateUser } from '../../db/mutations/users/update-user';
import { publishUser } from '../../db/publishers';
import { protectedProcedure } from '../../utils/trpc';

const updateUserRoute = protectedProcedure
  .input(
    z.object({
      name: z.string().min(1).max(24),
      bannerColor: z
        .string()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color'),
      bio: z.string().max(160).optional()
    })
  )
  .mutation(async ({ ctx, input }) => {
    const updatedUser = await updateUser(ctx.user.id, {
      name: input.name,
      bannerColor: input.bannerColor,
      bio: input.bio
    });

    if (!updatedUser) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR'
      });
    }

    await publishUser(updatedUser.id, 'update');
  });

export { updateUserRoute };
