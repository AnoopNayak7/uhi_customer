'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { useJustListed } from '@/hooks/useJustListed';

interface NewFlat {
  id: string;
  title: string;
  city: string;
  district?: string;
  reraId?: string;
  totalUnits?: number | null;
  reraStartDate?: string | null;
  createdAt: string;
  status: string;
}

/**
 * "New this month in Bengaluru" — newly RERA-registered projects surfaced to
 * customers (only approved rows; pending rows are admin-only). Subscribes to
 * the WebSocket feed so any freshly-approved project slides in without refresh.
 */
export default function NewProjectsInBengaluruPage() {
  const [flats, setFlats] = useState<NewFlat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { ids: justListedIds, items: liveItems, status } = useJustListed();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res: any = await apiClient.getNewFlatsInBengaluru({ days: 60, limit: 50 });
        if (!cancelled) setFlats(res?.data?.properties || []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load projects');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">New this month in Bengaluru</h1>
          <p className="text-sm text-neutral-500">
            Freshly registered projects, sourced from Karnataka RERA.
          </p>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-500'}`}>
          {status === 'open' ? 'Live' : status}
        </span>
      </header>

      {/* Live-pushed items first */}
      {liveItems.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-medium text-neutral-700 mb-2">Just listed</h2>
          <ul className="space-y-2">
            {liveItems.map((l) => (
              <li key={l.propertyId} className="p-3 border border-emerald-200 bg-emerald-50 rounded">
                <Link href={`/properties/${l.propertyId}`} className="font-medium hover:underline">{l.title}</Link>
                <p className="text-xs text-neutral-600">{l.district || l.city} · added {new Date(l.addedAt).toLocaleTimeString()}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {loading && <p className="text-sm text-neutral-500">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <ul className="grid gap-3 md:grid-cols-2">
        {flats.map((f) => (
          <li key={f.id} className="p-4 border border-neutral-200 rounded hover:border-neutral-400 transition">
            <div className="flex items-center gap-2 mb-1">
              <Link href={`/properties/${f.id}`} className="font-medium hover:underline">{f.title}</Link>
              {justListedIds.has(f.id) && (
                <span className="text-[10px] uppercase tracking-wide bg-emerald-500 text-white rounded px-1.5 py-0.5">Just listed</span>
              )}
            </div>
            <p className="text-xs text-neutral-600">
              {f.district || f.city}
              {f.totalUnits != null && <> · {f.totalUnits} units</>}
              {f.reraId && <> · RERA {f.reraId}</>}
            </p>
            <p className="text-[11px] text-neutral-400 mt-1">
              Registered {f.reraStartDate ? new Date(f.reraStartDate).toLocaleDateString() : '—'}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
