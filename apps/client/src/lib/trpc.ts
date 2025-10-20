import { SessionStorageKey } from '@/types';
import type { AppRouter, TConnectionParams } from '@sharkord/shared';
import { createTRPCProxyClient, createWSClient, wsLink } from '@trpc/client';

let wsClient: ReturnType<typeof createWSClient> | null = null;
let trpc: ReturnType<typeof createTRPCProxyClient<AppRouter>> | null = null;
let currentHost: string | null = null;

const initializeTRPC = (host: string) => {
  wsClient = createWSClient({
    url: `ws://${host}`,
    onClose: (cause) => {
      console.log('WebSocket connection closed. Cause:', cause);

      trpc = null;
      wsClient = null;
    },
    connectionParams: async (): Promise<TConnectionParams> => {
      return {
        token: sessionStorage.getItem(SessionStorageKey.TOKEN) || ''
      };
    }
  });

  trpc = createTRPCProxyClient<AppRouter>({
    links: [wsLink({ client: wsClient })]
  });

  currentHost = host;

  return trpc;
};

const connectToTRPC = (host: string) => {
  if (trpc && currentHost === host) {
    return trpc;
  }

  return initializeTRPC(host);
};

const getTRPCClient = () => {
  if (!trpc) {
    throw new Error('TRPC client is not initialized');
  }

  return trpc;
};

const cleanup = () => {
  if (wsClient) {
    wsClient.close();
    wsClient = null;
  }
  trpc = null;
  currentHost = null;
};

export { cleanup, connectToTRPC, getTRPCClient, type AppRouter };
