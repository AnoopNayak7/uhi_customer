'use client';

import { useEffect, useState } from 'react';
import { connectRealtime, type RealtimeEvent } from '@/lib/ws';

export interface JustListedFlat {
  propertyId: string;
  title: string;
  city: string;
  district?: string;
  totalUnits?: number | null;
  reraId?: string;
  source?: string;
  addedAt: string;
}

/**
 * Subscribes to the customer_bengaluru_feed and accumulates newly-listed flats
 * as they are approved upstream. Components render a "Just listed" badge for
 * any property whose id appears in the returned set.
 */
export function useJustListed() {
  const [items, setItems] = useState<JustListedFlat[]>([]);
  const [status, setStatus] = useState<'connecting' | 'open' | 'closed'>('connecting');

  useEffect(() => {
    const client = connectRealtime({
      onStatusChange: setStatus,
      onEvent: (evt: RealtimeEvent) => {
        if (evt.type !== 'new_flat') return;
        const p = evt.payload as Partial<JustListedFlat> & { propertyId?: string };
        if (!p.propertyId) return;
        setItems((prev) => {
          if (prev.some((x) => x.propertyId === p.propertyId)) return prev;
          return [
            { ...p, propertyId: p.propertyId!, title: p.title || '', city: p.city || 'Bengaluru', addedAt: evt.createdAt },
            ...prev,
          ].slice(0, 20);
        });
      },
    });
    return () => client.close();
  }, []);

  return { items, status, ids: new Set(items.map((i) => i.propertyId)) };
}
