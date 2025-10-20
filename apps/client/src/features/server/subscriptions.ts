import { getTRPCClient } from '@/lib/trpc';
import { type TSettings } from '@sharkord/shared';
import { setServerSettings } from './actions';
import { subscribeToChannels } from './channels/subscriptions';
import { subscribeToEmojis } from './emojis/subscriptions';
import { subscribeToMessages } from './messages/subscriptions';
import { subscribeToRoles } from './roles/subscriptions';
import { subscribeToUsers } from './users/subscriptions';

const subscribeToServer = () => {
  const trpc = getTRPCClient();

  const onSettingsUpdateSub = trpc.others.onServerSettingsUpdate.subscribe(
    undefined,
    {
      onData: (settings: TSettings) =>
        setServerSettings({
          name: settings.name,
          description: settings.description ?? '',
          serverId: settings.serverId ?? ''
        }),
      onError: (err) =>
        console.error('onSettingsUpdate subscription error:', err)
    }
  );

  return () => {
    onSettingsUpdateSub.unsubscribe();
  };
};

const initSubscriptions = () => {
  subscribeToChannels();
  subscribeToServer();
  subscribeToEmojis();
  subscribeToRoles();
  subscribeToUsers();
  subscribeToMessages();
};

export { initSubscriptions };
