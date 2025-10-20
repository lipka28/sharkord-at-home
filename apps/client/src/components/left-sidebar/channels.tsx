import { setSelectedChannelId } from '@/features/server/channels/actions';
import {
  useChannelById,
  useChannelsByCategoryId,
  useSelectedChannelId
} from '@/features/server/channels/hooks';
import { cn } from '@/lib/utils';
import { ChannelType } from '@/types';
import { Hash, Volume2 } from 'lucide-react';
import { memo, useCallback } from 'react';
import { ChannelContextMenu } from '../context-menus/channel';

type TChannelProps = {
  channelId: number;
  isSelected: boolean;
};

const Channel = memo(({ channelId, isSelected }: TChannelProps) => {
  const channel = useChannelById(channelId);

  const onClick = useCallback(() => {
    setSelectedChannelId(channelId);
  }, [channelId]);

  if (!channel) {
    return null;
  }

  const ChannelIcon = channel.type === ChannelType.TEXT ? Hash : Volume2;

  return (
    <ChannelContextMenu channelId={channel.id}>
      <div
        key={channel.name}
        className={cn(
          'flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground select-none',
          {
            'bg-accent text-accent-foreground': isSelected
          }
        )}
        onClick={onClick}
      >
        <ChannelIcon className="h-4 w-4" />
        <span>{channel.name}</span>
      </div>
    </ChannelContextMenu>
  );
});

type TChannelsProps = {
  categoryId: number;
};

const Channels = memo(({ categoryId }: TChannelsProps) => {
  const channels = useChannelsByCategoryId(categoryId);
  const selectedChannelId = useSelectedChannelId();

  return (
    <div className="space-y-0.5">
      {channels.map((channel) => (
        <Channel
          key={channel.id}
          channelId={channel.id}
          isSelected={selectedChannelId === channel.id}
        />
      ))}
    </div>
  );
});

export { Channels };
