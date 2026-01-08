import fs from 'node:fs/promises';
import { pluginManager } from '.';
import { PLUGINS_PATH } from '../helpers/paths';
import { logger } from '../logger';

const loadPlugins = async () => {
  const files = await fs.readdir(PLUGINS_PATH);

  logger.debug(`Found ${files.length} plugins`);

  for (const file of files) {
    try {
      await pluginManager.load(file);
    } catch (error) {
      logger.error(
        `Failed to load plugin ${file}: ${(error as Error).message}`
      );
    }
  }
};

export { loadPlugins };
