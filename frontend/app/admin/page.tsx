'use client';

import { useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { deleteCamper, fetchCampers, fetchStats, updateCamperStatus, CamperStats } from '@/lib/api';
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
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  const busArrivedCount = useMemo(() => campers.filter((c) => c.busArrived).length, [campers]);
  const campArrivedCount = useMemo(() => campers.filter((c) => c.campArrived).length, [campers]);

  function handleExportExcel() {
    if (campers.length === 0) {
      alert('There are no camper records to export.');
      return;
    }

    const rows = campers.map((c) => ({
      Name: c.fullName,
      Age: c.age,
      Area: areaLabel(c.area),
      Mobile: c.mobileNumber,
      School: c.school,
      'Date of Birth': c.dateOfBirth,
      Gender: c.gender,
      Address: c.address,
      'Parent / guardian name': c.parentsName,
      'Parent telephone': c.telephoneNumberOfParents,
      Religion: c.religion,
      'Medical conditions': c.medicalConditions || 'None',
      'Invited by': c.invitedBy,
      'Free days': c.availableDays.join(', '),
      'Registered at': new Date(c.createdAt).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Campers');
    XLSX.writeFile(workbook, `campers-export-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

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

  async function handleStatusUpdate(id: string, updates: { busArrived?: boolean; campArrived?: boolean }) {
    try {
      await updateCamperStatus(id, updates);
      await load();
    } catch {
      alert('Could not update camper status.');
    }
  }

  return (
    <main className="min-h-screen bg-canvas-50">
      <header className="bg-pine-900 px-4 py-5 text-canvas-50 sm:px-6 sm:py-6 lg:px-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sun-400 sm:text-xs">
          Camp Registration
        </p>
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl">Registration Desk</h1>
        <p className="mt-1 text-xs text-canvas-100/80 sm:text-sm">
          {stats ? `${stats.total} camper${stats.total === 1 ? '' : 's'} registered so far` : 'Loading totals…'}
        </p>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">

        <div className="mb-6 flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

            <button
              type="button"
              onClick={handleExportExcel}
              disabled={state !== 'ready' || campers.length === 0}
              className="inline-flex items-center justify-center rounded-full bg-pine-900 px-4 py-2.5 text-sm font-semibold text-canvas-50 transition hover:bg-pine-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Export to Excel
            </button>
          </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-700">Bus arrived</p>
            <p className="mt-1 text-2xl font-semibold text-amber-900">{busArrivedCount}</p>
          </div>
          <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sky-700">Camp arrived</p>
            <p className="mt-1 text-2xl font-semibold text-sky-900">{campArrivedCount}</p>
          </div>
        </div>
        
          {/* Filter chips: horizontal scroll on mobile instead of wrapping */}
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
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

        {state === 'loading' && (
          <div className="rounded-2xl border border-canvas-200 bg-white px-5 py-10 text-center text-sm text-ink-700 shadow-sm">
            Loading registrations…
          </div>
        )}

        {state === 'ready' && campers.length === 0 && (
          <div className="rounded-2xl border border-canvas-200 bg-white px-5 py-10 text-center text-sm text-ink-700 shadow-sm">
            No registrations match yet. Try a different search or area.
          </div>
        )}

        {/* Mobile / tablet: stacked cards */}
        {state === 'ready' && campers.length > 0 && (
          <div className="space-y-3 md:hidden">
            {campers.map((c) => {
              const isExpanded = expandedId === c.id;
              return (
                <div
                  key={c.id}
                  className="rounded-2xl border border-canvas-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink-900">{c.fullName}</p>
                      <p className="text-xs text-ink-700">
                        Age {c.age} · {c.mobileNumber}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-pine-700/10 px-2.5 py-1 text-xs font-semibold text-pine-700">
                      {areaLabel(c.area)}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-700">
                    <span>{c.school}</span>
                    <span>·</span>
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : c.id)}
                    className="mt-2 text-xs font-semibold text-pine-700 underline"
                  >
                    {isExpanded ? 'Hide details' : 'Show details'}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 space-y-1 border-t border-canvas-100 pt-3 text-xs text-ink-700">
                      <div><span className="font-semibold text-ink-900">DOB:</span> {c.dateOfBirth}</div>
                      <div><span className="font-semibold text-ink-900">Gender:</span> {c.gender}</div>
                      <div><span className="font-semibold text-ink-900">Address:</span> {c.address}</div>
                      <div><span className="font-semibold text-ink-900">Parent:</span> {c.parentsName}</div>
                      <div><span className="font-semibold text-ink-900">Parent tel:</span> {c.telephoneNumberOfParents}</div>
                      <div><span className="font-semibold text-ink-900">Religion:</span> {c.religion}</div>
                      <div><span className="font-semibold text-ink-900">Medical conditions:</span> {c.medicalConditions || 'None'}</div>
                      <div><span className="font-semibold text-ink-900">Invited by:</span> {c.invitedBy}</div>
                      <div><span className="font-semibold text-ink-900">Free days:</span> {c.availableDays.join(', ')}</div>
                    </div>
                  )}

                  <div className="mt-3 space-y-2 border-t border-canvas-100 pt-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleStatusUpdate(c.id, { busArrived: !c.busArrived })}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                          c.busArrived ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.busArrived ? 'Bus arrived' : 'Mark bus arrived'}
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(c.id, { campArrived: !c.campArrived })}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                          c.campArrived ? 'bg-emerald-600 text-white' : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {c.campArrived ? 'Camp arrived' : 'Mark camp arrived'}
                      </button>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDelete(c.id)}
                        disabled={deletingId === c.id}
                        className="text-xs font-semibold text-ember-600 hover:underline disabled:opacity-50"
                      >
                        {deletingId === c.id ? 'Removing…' : 'Remove'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Desktop: table */}
        {state === 'ready' && campers.length > 0 && (
          <div className="hidden overflow-hidden rounded-2xl border border-canvas-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
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
                  {campers.map((c) => (
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
                          <div><span className="font-semibold text-ink-900">Medical conditions:</span> {c.medicalConditions || 'None'}</div>
                          <div><span className="font-semibold text-ink-900">Invited by:</span> {c.invitedBy}</div>
                          <div><span className="font-semibold text-ink-900">Free days:</span> {c.availableDays.join(', ')}</div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-ink-700">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex flex-wrap justify-end gap-2">
                            <button
                              onClick={() => handleStatusUpdate(c.id, { busArrived: !c.busArrived })}
                              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                                c.busArrived ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {c.busArrived ? 'Bus arrived' : 'Mark bus arrived'}
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(c.id, { campArrived: !c.campArrived })}
                              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                                c.campArrived ? 'bg-emerald-600 text-white' : 'bg-sky-100 text-sky-800'
                              }`}
                            >
                              {c.campArrived ? 'Camp arrived' : 'Mark camp arrived'}
                            </button>
                          </div>
                          <button
                            onClick={() => handleDelete(c.id)}
                            disabled={deletingId === c.id}
                            className="text-xs font-semibold text-ember-600 hover:underline disabled:opacity-50"
                          >
                            {deletingId === c.id ? 'Removing…' : 'Remove'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
      className={`shrink-0 rounded-full border-2 px-3.5 py-1.5 text-xs font-semibold transition ${
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