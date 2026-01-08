import type { AppData, Producer, Router } from "mediasoup/types";
import type { StreamKind } from "@sharkord/shared";

export type ServerEvent =
  | "user:joined"
  | "user:left"
  | "message:created"
  | "message:updated"
  | "message:deleted"
  | "voice:runtime_initialized";

export interface EventPayloads {
  "user:joined": {
    userId: number;
    username: string;
  };
  "user:left": {
    userId: number;
    username: string;
  };
  "message:created": {
    messageId: number;
    channelId: number;
    userId: number;
    content: string;
  };
  "message:updated": {
    messageId: number;
    channelId: number;
    userId: number;
    content: string;
  };
  "message:deleted": {
    messageId: number;
    channelId: number;
  };
  "voice:runtime_initialized": {
    channelId: number;
  };
}

export interface CommandContext {
  userId: string;
  reply: (msg: string) => void;
}

export interface CommandDefinition {
  name: string;
  description?: string;
  execute(ctx: CommandContext): void | Promise<void>;
}

export interface PluginContext {
  path: string;

  log(...args: unknown[]): void;
  debug(...args: unknown[]): void;

  events: {
    on<E extends ServerEvent>(
      event: E,
      handler: (payload: EventPayloads[E]) => void | Promise<void>
    ): void;
  };

  actions: {
    voice: {
      getRouter(channelId: number): Promise<Router<AppData> | null>;
      addExternalProducer(
        channelId: number,
        type: StreamKind,
        producer: Producer
      ): number;
    };
  };

  // commands: {
  //   register(command: CommandDefinition): void;
  // };

  // storage: {
  //   get<T>(key: string): Promise<T | null>;
  //   set<T>(key: string, value: T): Promise<void>;
  // };
}

export interface UnloadPluginContext
  extends Pick<PluginContext, "log" | "debug"> {}
