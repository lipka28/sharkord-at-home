import { TextChannel } from '@/components/channel-view/text';
import { useSelectedChannel } from '@/features/server/channels/hooks';
import { ChannelType } from '@/types';
import { memo } from 'react';

const ContentWrapper = memo(() => {
  const selectedChannel = useSelectedChannel();

  let content;

  if (selectedChannel) {
    if (selectedChannel.type === ChannelType.TEXT) {
      content = (
        <TextChannel key={selectedChannel.id} channelId={selectedChannel.id} />
      );
    } else if (selectedChannel.type === ChannelType.VOICE) {
      content = (
        <div className="flex flex-1 items-center justify-center text-muted">
          Voice Channel - TODO!
        </div>
      );
    }
  } else {
    content = null;
  }

  return <main className="flex flex-1 flex-col bg-background">{content}</main>;
});

export { ContentWrapper };
