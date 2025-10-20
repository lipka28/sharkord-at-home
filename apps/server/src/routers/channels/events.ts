import { ServerEvents } from '@sharkord/shared';
import { protectedProcedure } from '../../utils/trpc';

const onChannelCreateRoute = protectedProcedure.subscription(
  async ({ ctx }) => {
    return ctx.pubsub.subscribe(ServerEvents.CHANNEL_CREATE);
  }
);

const onChannelDeleteRoute = protectedProcedure.subscription(
  async ({ ctx }) => {
    return ctx.pubsub.subscribe(ServerEvents.CHANNEL_DELETE);
  }
);

const onChannelUpdateRoute = protectedProcedure.subscription(
  async ({ ctx }) => {
    return ctx.pubsub.subscribe(ServerEvents.CHANNEL_UPDATE);
  }
);

export { onChannelCreateRoute, onChannelDeleteRoute, onChannelUpdateRoute };
