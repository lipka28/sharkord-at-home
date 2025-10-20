import { ServerEvents } from '@sharkord/shared';
import { protectedProcedure } from '../../utils/trpc';

const onMessageDeleteRoute = protectedProcedure.subscription(
  async ({ ctx }) => {
    return ctx.pubsub.subscribe(ServerEvents.MESSAGE_DELETE);
  }
);

const onMessageUpdateRoute = protectedProcedure.subscription(
  async ({ ctx }) => {
    return ctx.pubsub.subscribe(ServerEvents.MESSAGE_UPDATE);
  }
);

const onMessageRoute = protectedProcedure.subscription(async ({ ctx }) => {
  return ctx.pubsub.subscribe(ServerEvents.NEW_MESSAGE);
});

export { onMessageDeleteRoute, onMessageRoute, onMessageUpdateRoute };
