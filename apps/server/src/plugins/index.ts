import type { PluginContext, UnloadPluginContext } from '@sharkord/plugin-sdk';
import { zPluginPackageJson, type TPluginInfo } from '@sharkord/shared';
import chalk from 'chalk';
import fs from 'node:fs/promises';
import path from 'path';
import { PLUGINS_PATH } from '../helpers/paths';
import { logger } from '../logger';
import { VoiceRuntime } from '../runtimes/voice';
import { eventBus } from './event-bus';

type PluginModule = {
  onLoad: (ctx: PluginContext) => void | Promise<void>;
  onUnload?: (ctx: UnloadPluginContext) => void | Promise<void>;
};

class PluginManager {
  private loadedPlugins = new Map<string, PluginModule>();
  private loadErrors = new Map<string, string>();

  private getPluginPath = (pluginId: string) =>
    path.join(PLUGINS_PATH, pluginId);

  public togglePlugin = async (pluginId: string, enabled: boolean) => {
    const pluginPath = this.getPluginPath(pluginId);
    const packageJsonPath = path.join(pluginPath, 'package.json');

    if (!(await fs.exists(packageJsonPath))) {
      throw new Error('package.json not found');
    }

    const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);

    if (!packageJson.sharkord) {
      packageJson.sharkord = {};
    }

    packageJson.sharkord.enabled = enabled;

    await fs.writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      'utf-8'
    );

    // was disabled and is now being enabled
    if (!enabled && this.loadedPlugins.has(pluginId)) {
      await this.unload(pluginId);
    }

    // was enabled and is now being disabled
    if (enabled && !this.loadedPlugins.has(pluginId)) {
      await this.load(pluginId);
    }
  };

  public unload = async (pluginId: string) => {
    const pluginModule = this.loadedPlugins.get(pluginId);

    if (!pluginModule) {
      logger.debug(`Plugin ${pluginId} is not loaded; nothing to unload.`);
      return;
    }

    if (typeof pluginModule.onUnload === 'function') {
      try {
        const unloadCtx = this.createUnloadContext(pluginId);

        await pluginModule.onUnload(unloadCtx);
      } catch (error) {
        logger.error(`Error in plugin ${pluginId} onUnload:`, error);
      }
    }

    eventBus.unload(pluginId);
    this.loadedPlugins.delete(pluginId);
    this.loadErrors.delete(pluginId);

    logger.info(`Plugin unloaded: ${pluginId}`);
  };

  public getPluginInfo = async (pluginId: string): Promise<TPluginInfo> => {
    const pluginPath = this.getPluginPath(pluginId);
    const packageJsonPath = path.join(pluginPath, 'package.json');

    if (!(await fs.exists(packageJsonPath))) {
      throw new Error('package.json not found');
    }

    const packageJson = zPluginPackageJson.parse(
      JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))
    );

    const entryFilePath = path.join(pluginPath, packageJson.sharkord.entry);

    if (!(await fs.exists(entryFilePath))) {
      throw new Error('Plugin entry file not found');
    }

    // Get load error if it exists
    const loadError = this.loadErrors.get(pluginId);

    return {
      id: pluginId,
      enabled: packageJson.sharkord.enabled,
      name: packageJson.name,
      path: pluginPath,
      description: packageJson.sharkord.description,
      version: packageJson.version,
      logo: packageJson.sharkord.logo,
      author: packageJson.sharkord.author,
      homepage: packageJson.sharkord.homepage,
      entry: entryFilePath,
      loadError
    };
  };

  public load = async (pluginId: string) => {
    const info = await this.getPluginInfo(pluginId);

    if (!info.enabled) {
      logger.debug(`Plugin ${pluginId} is disabled; skipping load.`);
      return;
    }

    try {
      const ctx = this.createContext(pluginId);
      const mod = await import(info.entry);

      if (typeof mod.onLoad !== 'function') {
        throw new Error(
          `Plugin ${pluginId} does not export an 'onLoad' function`
        );
      }

      await mod.onLoad(ctx);

      this.loadedPlugins.set(pluginId, mod as PluginModule);
      // Clear any previous load errors
      this.loadErrors.delete(pluginId);

      logger.info(
        `Plugin loaded: ${pluginId}@v${info.version} by ${info.author}`
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // Store the load error
      this.loadErrors.set(pluginId, errorMessage);

      logger.error(`Failed to load plugin ${pluginId}: ${errorMessage}`);

      // Clean up if partially loaded
      await this.unload(pluginId);

      // Don't rethrow - we want to continue loading other plugins
    }
  };

  private createContext = (pluginId: string): PluginContext => {
    return {
      path: this.getPluginPath(pluginId),
      log: (...message: unknown[]) => {
        logger.info(
          `${chalk.magentaBright(`[plugin:${pluginId}]`)} ${message.map((m) => (typeof m === 'object' ? JSON.stringify(m) : String(m))).join(' ')}`
        );
      },
      debug: (...message: unknown[]) => {
        logger.debug(
          `${chalk.magentaBright(`[plugin:${pluginId}]`)} ${message.map((m) => (typeof m === 'object' ? JSON.stringify(m) : String(m))).join(' ')}`
        );
      },
      events: {
        on: (event, handler) => {
          eventBus.register(pluginId, event, handler);
        }
      },
      actions: {
        voice: {
          getRouter: async (channelId: number) => {
            const channel = VoiceRuntime.findById(channelId);

            if (!channel) {
              throw new Error(
                `Voice runtime not found for channel ID ${channelId}`
              );
            }

            return channel.getRouter();
          },
          addExternalProducer: (channelId, type, producer) => {
            const channel = VoiceRuntime.findById(channelId);

            if (!channel) {
              throw new Error(
                `Voice runtime not found for channel ID ${channelId}`
              );
            }

            return channel.addExternalProducer(type, producer);
          }
        }
      }
    };
  };

  private createUnloadContext = (pluginId: string): UnloadPluginContext => {
    const baseCtx = this.createContext(pluginId);

    return {
      log: baseCtx.log,
      debug: baseCtx.debug
    };
  };
}

const pluginManager = new PluginManager();

export { pluginManager };
