import type { TJoinedSettings } from '@sharkord/shared';
import { db } from '../..';
import { getFile } from '../../mutations/files/get-file';
import { settings } from '../../schema';

const getSettings = async (): Promise<TJoinedSettings> => {
  const serverSettings = await db.select().from(settings).get()!;

  const logo = serverSettings.logoId
    ? await getFile(serverSettings.logoId)
    : undefined;

  return {
    ...serverSettings,
    logo: logo ?? null
  };
};

export { getSettings };
