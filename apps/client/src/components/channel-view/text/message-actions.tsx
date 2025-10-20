import { EmojiPicker } from '@/components/emoji-picker';
import type { TEmojiItem } from '@/components/tiptap-input/types';
import { getTRPCClient } from '@/lib/trpc';
import { Pencil, Smile, Trash } from 'lucide-react';
import { memo, useCallback } from 'react';
import { toast } from 'sonner';
import { Button } from '../../ui/button';

type TMessageActionsProps = {
  messageId: number;
  onEdit: () => void;
  disabled: boolean;
};

const MessageActions = memo(
  ({ onEdit, disabled, messageId }: TMessageActionsProps) => {
    const onDeleteClick = useCallback(async () => {
      const trpc = getTRPCClient();

      try {
        await trpc.messages.delete.mutate({ messageId });
        toast.success('Message deleted');
      } catch {
        toast.error('Failed to delete message');
      }
    }, [messageId]);

    const onEmojiSelect = useCallback(
      async (emoji: TEmojiItem) => {
        const trpc = getTRPCClient();

        try {
          await trpc.messages.toggleReaction.mutate({
            messageId,
            emoji: emoji.shortcodes[0]
          });
        } catch (error) {
          toast.error('Failed to add reaction');

          console.error('Error adding reaction:', error);
        }
      },
      [messageId]
    );

    if (disabled) return null;

    return (
      <div className="gap-2 absolute right-0 -top-6 z-10 hidden group-hover:flex [&:has([data-state=open])]:flex items-center space-x-1 rounded-lg shadow-lg border border-border p-1 transition-all h-8">
        <Button size="iconXs" variant="ghost" onClick={onEdit}>
          <Pencil className="h-2 w-2" />
        </Button>
        <Button size="iconXs" variant="ghost" onClick={onDeleteClick}>
          <Trash className="h-2 w-2" />
        </Button>
        <EmojiPicker onEmojiSelect={onEmojiSelect}>
          <Button variant="ghost" size="iconXs">
            <Smile className="h-2 w-2" />
          </Button>
        </EmojiPicker>
      </div>
    );
  }
);

export { MessageActions };
