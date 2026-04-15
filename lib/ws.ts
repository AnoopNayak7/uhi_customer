// Customer-side WebSocket wrapper. Subscribes to the `customer_bengaluru_feed`
// topic so newly-approved projects surface on the home/projects pages live.
'use client';

import { APP_CONFIG } from './config';

export type RealtimeEventType = 'new_builder' | 'new_flat' | 'buyer_intent';

export interface RealtimeEvent<P = unknown> {
  type: RealtimeEventType;
  topic: 'admin_feed' | 'customer_bengaluru_feed';
  payload: P;
  eventId: string;
  createdAt: string;
}

export interface RealtimeClientOptions {
  topic?: 'customer_bengaluru_feed';
  onEvent: (event: RealtimeEvent) => void;
  onStatusChange?: (status: 'connecting' | 'open' | 'closed') => void;
}

export function connectRealtime({
  topic = 'customer_bengaluru_feed',
  onEvent,
  onStatusChange,
}: RealtimeClientOptions) {
  if (typeof window === 'undefined') {
    // SSR guard — no-op on the server.
    return { close: () => undefined };
  }

  let socket: WebSocket | null = null;
  let shouldReconnect = true;
  let retryDelay = 1000;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;

  const open = () => {
    onStatusChange?.('connecting');
    const url = `${APP_CONFIG.wsUrl}?topic=${encodeURIComponent(topic)}`;
    socket = new WebSocket(url);
    socket.onopen = () => {
      retryDelay = 1000;
      onStatusChange?.('open');
    };
    socket.onmessage = (e) => {
      try {
        onEvent(JSON.parse(e.data) as RealtimeEvent);
      } catch {
        // ignore non-JSON frames
      }
    };
    socket.onclose = () => {
      onStatusChange?.('closed');
      if (!shouldReconnect) return;
      retryTimer = setTimeout(open, retryDelay);
      retryDelay = Math.min(retryDelay * 2, 15000);
    };
    socket.onerror = () => socket?.close();
  };

  open();

  return {
    close() {
      shouldReconnect = false;
      if (retryTimer) clearTimeout(retryTimer);
      socket?.close();
    },
  };
}
