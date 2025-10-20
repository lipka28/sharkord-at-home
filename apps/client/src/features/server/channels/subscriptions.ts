import { getTRPCClient } from '@/lib/trpc';
import type { TChannel } from '@sharkord/shared';
import { addChannel, removeChannel, updateChannel } from './actions';

const subscribeToChannels = () => {
  const trpc = getTRPCClient();

  const onChannelCreateSub = trpc.channels.onCreate.subscribe(undefined, {
    onData: (channel: TChannel) => addChannel(channel),
    onError: (err) => console.error('onChannelCreate subscription error:', err)
  });

  const onChannelDeleteSub = trpc.channels.onDelete.subscribe(undefined, {
    onData: (channelId: number) => removeChannel(channelId),
    onError: (err) => console.error('onChannelDelete subscription error:', err)
  });

  const onChannelUpdateSub = trpc.channels.onUpdate.subscribe(undefined, {
    onData: (channel: TChannel) => updateChannel(channel.id, channel),
    onError: (err) => console.error('onChannelUpdate subscription error:', err)
  });

  return () => {
    onChannelCreateSub.unsubscribe();
    onChannelDeleteSub.unsubscribe();
    onChannelUpdateSub.unsubscribe();
  };
};

export { subscribeToChannels };
