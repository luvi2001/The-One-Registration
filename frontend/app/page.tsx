'use client';

import { useEffect, useState } from 'react';
import CampPosterBackground from '@/components/CampPosterBackground';
import RegistrationForm from '@/components/RegistrationForm';
import { fetchRegistrationStatus } from '@/lib/api';

export default function HomePage() {
  const [registrationOpen, setRegistrationOpen] = useState<boolean | null>(null);

  useEffect(() => {
    fetchRegistrationStatus()
      .then(({ isOpen }) => setRegistrationOpen(isOpen))
      .catch(() => setRegistrationOpen(true));
  }, []);

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-pine-900 px-4 py-8 sm:px-6 lg:px-8">
      <CampPosterBackground />
      <div className="relative z-10 flex w-full max-w-6xl items-center justify-center">
        <div className="w-full max-w-md">
          {registrationOpen === null ? (
            <div className="rounded-2xl bg-canvas-50 p-8 text-center shadow-canvas">
              <p className="text-sm text-ink-700">Checking registration status…</p>
            </div>
          ) : registrationOpen === false ? (
            <div className="rise-in rounded-2xl bg-canvas-50 p-8 text-center shadow-canvas">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-ember-600">Camp registration</p>
              <h1 className="mt-3 font-display text-4xl leading-none text-pine-900">Registration closed</h1>
              <p className="mt-3 text-sm text-ink-700">Registration is no longer available. Please contact the camp team for more information.</p>
              <p className="mt-3 text-sm text-ink-700">075 258 2063</p>
            </div>
          ) : (
            <RegistrationForm />
          )}
        </div>
      </div>
    </main>
  );
}
