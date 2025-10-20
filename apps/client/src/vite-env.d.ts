/// <reference types="vite/client" />

// Extend the Window interface for global functions
declare global {
  interface Window {
    useToken: (token: string) => Promise<void>;
  }

  const VITE_APP_VERSION: string;
}

export {};
