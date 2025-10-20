import { z } from 'zod';
import { updateSettings as updateSettingsMutation } from '../../db/mutations/server/update-server-settings';
import { publishSettings } from '../../db/publishers';
import { protectedProcedure } from '../../utils/trpc';

const updateSettingsRoute = protectedProcedure
  .input(
    z.object({
      name: z.string().min(2).max(24),
      description: z.string().max(128).nullable(),
      password: z.string().min(1).max(32).nullable(),
      allowNewUsers: z.boolean()
    })
  )
  .mutation(async ({ input }) => {
    await updateSettingsMutation({
      name: input.name,
      description: input.description,
      password: input.password,
      allowNewUsers: input.allowNewUsers
    });

    await publishSettings();
  });

export { updateSettingsRoute };
