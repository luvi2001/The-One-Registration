'use client';

import { useEffect, useMemo, useState } from 'react';
import { deleteCamper, fetchCampers, fetchStats, CamperStats } from '@/lib/api';
import { AREAS, AreaValue, Camper, areaLabel } from '@/lib/types';

type LoadState = 'loading' | 'ready' | 'error';

export default function AdminPage() {
  const [campers, setCampers] = useState<Camper[]>([]);
  const [stats, setStats] = useState<CamperStats | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [area, setArea] = useState<AreaValue | 'ALL'>('ALL');
  const [state, setState] = useState<LoadState>('loading');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  async function load() {
    setState('loading');
    try {
      const [campersData, statsData] = await Promise.all([
        fetchCampers({
          area: area === 'ALL' ? undefined : area,
          search: debouncedSearch || undefined,
        }),
        fetchStats(),
      ]);
      setCampers(campersData);
      setStats(statsData);
      setState('ready');
    } catch {
      setState('error');
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [area, debouncedSearch]);

  const countForArea = useMemo(() => {
    const map = new Map<string, number>();
    stats?.byArea.forEach((a) => map.set(a.area, a.count));
    return map;
  }, [stats]);

  async function handleDelete(id: string) {
    if (!confirm('Remove this registration? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteCamper(id);
      await load();
    } catch {
      alert('Could not remove this registration. Please try again.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-canvas-50">
      <header className="bg-pine-900 px-6 py-6 text-canvas-50 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-sun-400">Camp Registration</p>
        <h1 className="font-display text-3xl sm:text-4xl">Registration Desk</h1>
        <p className="mt-1 text-sm text-canvas-100/80">
          {stats ? `${stats.total} camper${stats.total === 1 ? '' : 's'} registered so far` : 'Loading totals…'}
        </p>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pine-700/60"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, school, or mobile"
              className="w-full rounded-full border-2 border-canvas-200 bg-white py-2.5 pl-9 pr-4 text-sm text-ink-900 focus:border-ember-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <FilterChip
              label="All areas"
              active={area === 'ALL'}
              onClick={() => setArea('ALL')}
              count={stats?.total}
            />
            {AREAS.map((a) => (
              <FilterChip
                key={a.value}
                label={a.label}
                active={area === a.value}
                onClick={() => setArea(a.value)}
                count={countForArea.get(a.value) ?? 0}
              />
            ))}
          </div>
        </div>

        {state === 'error' && (
          <div className="rounded-xl border-2 border-ember-500/30 bg-ember-500/10 px-4 py-3 text-sm text-ember-600">
            Couldn&apos;t load registrations. Check that the API server is running, then refresh.
          </div>
        )}

        {state !== 'error' && (
          <div className="overflow-hidden rounded-2xl border border-canvas-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-canvas-200 bg-canvas-50 text-xs font-bold uppercase tracking-wide text-pine-700">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Age</th>
                  <th className="px-5 py-3">Area</th>
                  <th className="px-5 py-3">Mobile</th>
                  <th className="px-5 py-3">School</th>
                  <th className="px-5 py-3">Details</th>
                  <th className="px-5 py-3">Registered</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {state === 'loading' && (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-ink-700">
                      Loading registrations…
                    </td>
                  </tr>
                )}
                {state === 'ready' && campers.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-ink-700">
                      No registrations match yet. Try a different search or area.
                    </td>
                  </tr>
                )}
                {state === 'ready' &&
                  campers.map((c) => (
                    <tr key={c.id} className="border-b border-canvas-100 last:border-0 hover:bg-canvas-50">
                      <td className="px-5 py-3 font-semibold text-ink-900">{c.fullName}</td>
                      <td className="px-5 py-3">{c.age}</td>
                      <td className="px-5 py-3">
                        <span className="rounded-full bg-pine-700/10 px-2.5 py-1 text-xs font-semibold text-pine-700">
                          {areaLabel(c.area)}
                        </span>
                      </td>
                      <td className="px-5 py-3">{c.mobileNumber}</td>
                      <td className="px-5 py-3">{c.school}</td>
                      <td className="px-5 py-3 text-xs text-ink-700">
                        <div className="space-y-1">
                          <div><span className="font-semibold text-ink-900">DOB:</span> {c.dateOfBirth}</div>
                          <div><span className="font-semibold text-ink-900">Gender:</span> {c.gender}</div>
                          <div><span className="font-semibold text-ink-900">Address:</span> {c.address}</div>
                          <div><span className="font-semibold text-ink-900">Parent:</span> {c.parentsName}</div>
                          <div><span className="font-semibold text-ink-900">Parent tel:</span> {c.telephoneNumberOfParents}</div>
                          <div><span className="font-semibold text-ink-900">Religion:</span> {c.religion}</div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-ink-700">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => handleDelete(c.id)}
                          disabled={deletingId === c.id}
                          className="text-xs font-semibold text-ember-600 hover:underline disabled:opacity-50"
                        >
                          {deletingId === c.id ? 'Removing…' : 'Remove'}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  count,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border-2 px-3.5 py-1.5 text-xs font-semibold transition ${
        active
          ? 'border-ember-500 bg-ember-500 text-white'
          : 'border-canvas-200 bg-white text-pine-700 hover:border-ember-500/50'
      }`}
    >
      {label}
      {typeof count === 'number' ? ` · ${count}` : ''}
    </button>
  );
}
