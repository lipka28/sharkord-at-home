import { TiptapInput } from '@/components/tiptap-input';
import Spinner from '@/components/ui/spinner';
import { useMessages } from '@/features/server/messages/hooks';
import { getTrpcError } from '@/helpers/parse-trpc-errors';
import { useUploadFiles } from '@/hooks/use-upload-files';
import { getTRPCClient } from '@/lib/trpc';
import { TYPING_MS } from '@sharkord/shared';
import { filesize } from 'filesize';
import { throttle } from 'lodash-es';
import { Send } from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../ui/button';
import { FileCard } from './file-card';
import { MessagesGroup } from './messages-group';
import { TextSkeleton } from './text-skeleton';
import { useScrollController } from './use-scroll-controller';
import { UsersTyping } from './users-typing';

type TChannelProps = {
  channelId: number;
};

const TextChannel = memo(({ channelId }: TChannelProps) => {
  const { files, removeFile, clearFiles, uploading, uploadingSize } =
    useUploadFiles();
  const { messages, hasMore, loadMore, loading, groupedMessages } =
    useMessages(channelId);
  const [newMessage, setNewMessage] = useState('');
  const { containerRef, onScroll } = useScrollController({
    messages,
    loading,
    hasMore,
    loadMore
  });

  const sendTypingSignal = useMemo(
    () =>
      throttle(async () => {
        const trpc = getTRPCClient();

        try {
          await trpc.messages.signalTyping.mutate({ channelId });
        } catch {
          // ignore
        }
      }, TYPING_MS),
    [channelId]
  );

  const onSendMessage = useCallback(async () => {
    if (!newMessage.trim() && !files.length) return;

    const trpc = getTRPCClient();

    try {
      await trpc.messages.send.mutate({
        content: newMessage,
        channelId,
        files: files.map((f) => f.id)
      });
    } catch (error) {
      toast.error(getTrpcError(error, 'Failed to send message'));
      return;
    }

    setNewMessage('');
    clearFiles();
  }, [newMessage, channelId, files, clearFiles]);

  const onRemoveFileClick = useCallback(
    async (fileId: string) => {
      removeFile(fileId);

      try {
        const trpc = getTRPCClient();

        await trpc.files.deleteTemporary.mutate({ fileId });
      } catch {
        // ignore error
      }
    },
    [removeFile]
  );

  if (loading) {
    return <TextSkeleton />;
  }

  return (
    <>
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-2 animate-in fade-in duration-500"
      >
        <div className="space-y-4">
          {groupedMessages.map((group, index) => (
            <MessagesGroup key={index} group={group} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-border p-2">
        {uploading && (
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground mb-1">
              Uploading files ({filesize(uploadingSize)})
            </div>
            <Spinner size="xxs" />
          </div>
        )}
        {files.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {files.map((file) => (
              <FileCard
                key={file.id}
                name={file.originalName}
                extension={file.extension}
                size={file.size}
                onRemove={() => onRemoveFileClick(file.id)}
              />
            ))}
          </div>
        )}
        <UsersTyping channelId={channelId} />
        <div className="flex items-center gap-2 rounded-lg">
          <TiptapInput
            value={newMessage}
            onChange={setNewMessage}
            onSubmit={onSendMessage}
            onTyping={sendTypingSignal}
          />
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={onSendMessage}
            disabled={uploading || !newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
});

export { TextChannel };
