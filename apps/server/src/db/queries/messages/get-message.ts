import type { TFile, TJoinedMessage, TMessageReaction } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { db } from '../..';
import { files, messageFiles, messageReactions, messages } from '../../schema';

const getMessage = async (
  messageId: number
): Promise<TJoinedMessage | undefined> => {
  const message = await db
    .select()
    .from(messages)
    .where(eq(messages.id, messageId))
    .limit(1)
    .get();

  if (!message) return undefined;

  const fileRows = await db
    .select({
      file: files
    })
    .from(messageFiles)
    .innerJoin(files, eq(messageFiles.fileId, files.id))
    .where(eq(messageFiles.messageId, messageId));

  const filesForMessage: TFile[] = fileRows.map((r) => r.file);

  const reactionRows = await db
    .select()
    .from(messageReactions)
    .where(eq(messageReactions.messageId, messageId));

  const reactions: TMessageReaction[] = reactionRows.map((r) => ({
    messageId: r.messageId,
    userId: r.userId,
    emoji: r.emoji,
    createdAt: r.createdAt,
    fileId: null
  }));

  return {
    ...message,
    files: filesForMessage ?? [],
    reactions: reactions ?? []
  };
};

export { getMessage };
