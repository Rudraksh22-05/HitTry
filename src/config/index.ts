export const config = {
  websocket: {
    serverUrl: import.meta.env.VITE_WEBSOCKET_SERVER_URL || 'ws://localhost:8005/ws',
  },
} as const; 