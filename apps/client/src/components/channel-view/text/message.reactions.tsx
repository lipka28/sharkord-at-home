import { Button } from '@/components/ui/button';
import { useOwnUserId } from '@/features/server/users/hooks';
import { getTRPCClient } from '@/lib/trpc';
import type { TMessageReaction } from '@sharkord/shared';
import { gitHubEmojis } from '@tiptap/extension-emoji';
import { memo, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

type TMessageReactionsProps = {
  messageId: number;
  reactions: TMessageReaction[];
};

type AggregatedReaction = {
  emoji: string;
  count: number;
  userIds: number[];
  isUserReacted: boolean;
  createdAt: number;
};

const MessageReactions = memo(
  ({ messageId, reactions }: TMessageReactionsProps) => {
    const ownUserId = useOwnUserId();

    const handleReactionClick = useCallback(
      async (emoji: string) => {
        if (!ownUserId) return;

        const trpc = getTRPCClient();

        try {
          await trpc.messages.toggleReaction.mutate({
            messageId,
            emoji
          });
        } catch (error) {
          toast.error('Failed to toggle reaction');
          console.error('Error toggling reaction:', error);
        }
      },
      [messageId, ownUserId]
    );

    const renderEmoji = useCallback((emojiName: string): React.ReactNode => {
      const gitHubEmoji = gitHubEmojis.find((e) => e.name === emojiName);

      if (gitHubEmoji?.emoji) {
        return <span className="text-sm">{gitHubEmoji.emoji}</span>;
      }

      // TODO: get file url from icon
      const customEmojiUrl =
        'https://preview.redd.it/64x64-pixel-art-from-online-image-not-mine-v0-nv84yfxfwxoe1.png?width=512&format=png&auto=webp&s=0785af099a6068d91594e102a6f527673255733c';

      return (
        <img
          src={customEmojiUrl}
          alt={`:${emojiName}:`}
          className="w-4 h-4 object-contain"
          onError={(e) => {
            // Fallback to text if image fails to load
            const target = e.target as HTMLImageElement;

            target.outerHTML = `<span class="text-xs text-muted-foreground">:${emojiName}:</span>`;
          }}
        />
      );
    }, []);

    const aggregatedReactions = useMemo((): AggregatedReaction[] => {
      const reactionMap = new Map<string, AggregatedReaction>();

      reactions.forEach((reaction) => {
        if (!reactionMap.has(reaction.emoji)) {
          reactionMap.set(reaction.emoji, {
            emoji: reaction.emoji,
            count: 0,
            userIds: [],
            isUserReacted: false,
            createdAt: reaction.createdAt
          });
        }

        const aggregated = reactionMap.get(reaction.emoji)!;

        aggregated.count++;
        aggregated.userIds.push(reaction.userId);

        if (ownUserId && reaction.userId === ownUserId) {
          aggregated.isUserReacted = true;
        }
      });

      // sort by first reaction createdAt desc
      return Array.from(reactionMap.values()).sort(
        (a, b) => b.createdAt + a.createdAt
      );
    }, [reactions, ownUserId]);

    if (!aggregatedReactions.length) return null;

    return (
      <div className="mt-1 flex flex-wrap gap-1">
        {aggregatedReactions.map((reaction) => {
          return (
            <Button
              key={`reaction-${reaction.emoji}`}
              size="sm"
              variant={reaction.isUserReacted ? 'default' : 'outline'}
              onClick={() => handleReactionClick(reaction.emoji)}
            >
              {renderEmoji(reaction.emoji)}
              <span className="font-medium">{reaction.count}</span>
            </Button>
          );
        })}
      </div>
    );
  }
);

export { MessageReactions };
