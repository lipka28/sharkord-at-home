import type { TSettings } from "./tables";

export enum ActivityLogType {
  SERVER_STARTED = "SERVER_STARTED",
  EDIT_SERVER_SETTINGS = "EDIT_SERVER_SETTINGS",
  USER_CREATED = "USER_CREATED",
  USER_JOINED = "USER_JOINED",
  USER_KICKED = "USER_KICKED",
  USER_BANNED = "USER_BANNED",
  USER_UNBANNED = "USER_UNBANNED",
}

export type TActivityLogDetailsMap = {
  [ActivityLogType.USER_CREATED]: {
    inviteCode: string | undefined;
    username: string;
  };
  [ActivityLogType.USER_JOINED]: {};
  [ActivityLogType.EDIT_SERVER_SETTINGS]: {
    values: Partial<{
      [K in keyof TSettings]: any;
    }>;
  };
  [ActivityLogType.SERVER_STARTED]: {};
  [ActivityLogType.USER_KICKED]: {
    reason: string | undefined;
    kickedBy: number;
  };
  [ActivityLogType.USER_BANNED]: {
    reason: string | undefined;
    bannedBy: number;
  };
  [ActivityLogType.USER_UNBANNED]: {
    unbannedBy: number;
  };
};

export type TActivityLogDetails<T extends ActivityLogType = ActivityLogType> = {
  type: T;
  details: TActivityLogDetailsMap[T];
};
