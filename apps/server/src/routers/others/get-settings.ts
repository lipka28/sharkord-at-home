import { Permission } from '@sharkord/shared';
import { getSettings as getSettingsQuery } from '../../db/queries/others/get-settings';
import { protectedProcedure } from '../../utils/trpc';

const getSettingsRoute = protectedProcedure.query(async ({ ctx }) => {
  await ctx.needsPermission(Permission.MANAGE_SERVER);

  const settings = await getSettingsQuery();

  return settings;
});

export { getSettingsRoute };
