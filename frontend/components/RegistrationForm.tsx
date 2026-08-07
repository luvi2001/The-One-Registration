'use client';

import { FormEvent, useState } from 'react';
import { registerCamper } from '@/lib/api';
import { AREAS, AreaValue } from '@/lib/types';

const PENNANT_COLORS = ['#E8743B', '#F4B942', '#3D7257', '#E8743B', '#F4B942', '#3D7257', '#E8743B'];

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function RegistrationForm() {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [area, setArea] = useState<AreaValue | ''>('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [school, setSchool] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [parentsName, setParentsName] = useState('');
  const [telephoneNumberOfParents, setTelephoneNumberOfParents] = useState('');
  const [religion, setReligion] = useState('');
  const [invitedBy, setInvitedBy] = useState('');
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const resetForm = () => {
    setFullName('');
    setAge('');
    setArea('');
    setMobileNumber('');
    setSchool('');
    setDateOfBirth('');
    setGender('');
    setAddress('');
    setParentsName('');
    setTelephoneNumberOfParents('');
    setReligion('');
    setInvitedBy('');
    setAvailableDays([]);
  };

  const handleDayToggle = (day: string) => {
    setAvailableDays((current) =>
      current.includes(day) ? current.filter((item) => item !== day) : [...current, day],
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    if (availableDays.length === 0) {
      setStatus('error');
      setErrorMessage('Please select at least one free day.');
      return;
    }

    try {
      await registerCamper({
        fullName: fullName.trim(),
        age: Number(age),
        area: area as AreaValue,
        mobileNumber: mobileNumber.trim(),
        school: school.trim(),
        dateOfBirth: dateOfBirth.trim(),
        gender: gender.trim(),
        address: address.trim(),
        parentsName: parentsName.trim(),
        telephoneNumberOfParents: telephoneNumberOfParents.trim(),
        religion: religion.trim(),
        invitedBy: invitedBy.trim(),
        availableDays,
      });
      setStatus('success');
      resetForm();
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Registration failed.');
    }
  };

  if (status === 'success') {
    return (
      <div className="rise-in relative z-10 w-full max-w-md rounded-2xl bg-canvas-50 p-8 text-center shadow-canvas">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pine-700 text-canvas-50">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5 10 17 19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="font-display text-3xl text-pine-900">You&apos;re on the list!</h2>
        <p className="mt-2 text-ink-700">
          The camper is registered. See you at camp!
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 rounded-full bg-ember-500 px-6 py-3 font-semibold text-canvas-50 transition hover:bg-ember-600"
        >
          Register another camper
        </button>
      </div>
    );
  }

  return (
    <div className="rise-in relative z-10 w-full max-w-md">
      <div className="grain relative overflow-hidden rounded-b-2xl bg-canvas-50 px-7 pb-8 shadow-canvas">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-ember-600 mt-4">Camp registration</p>
          <h1 className="font-display text-4xl leading-none text-pine-900 sm:text-5xl">
            Join The Camp
          </h1>
          <p className="mt-2 text-sm text-ink-700">
            Fill in a camper&apos;s details below to save their spot.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <Field label="Camper's full name" htmlFor="fullName">
            <input
              id="fullName"
              required
              minLength={2}
              maxLength={100}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Nimal Perera"
              className="camp-input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Age" htmlFor="age">
              <input
                id="age"
                type="number"
                required
                min={3}
                max={25}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="12"
                className="camp-input"
              />
            </Field>

            <Field label="Area" htmlFor="area">
              <select
                id="area"
                required
                value={area}
                onChange={(e) => setArea(e.target.value as AreaValue)}
                className="camp-input"
              >
                <option value="" disabled>
                  Select
                </option>
                {AREAS.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Mobile number" htmlFor="mobileNumber">
            <input
              id="mobileNumber"
              type="tel"
              required
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="07X XXX XXXX"
              className="camp-input"
            />
          </Field>

          <Field label="School" htmlFor="school">
            <input
              id="school"
              required
              maxLength={150}
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="e.g. Ananda College"
              className="camp-input"
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Date of birth" htmlFor="dateOfBirth">
              <input
                id="dateOfBirth"
                type="date"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="camp-input"
              />
            </Field>

            <Field label="Gender" htmlFor="gender">
              <select
                id="gender"
                required
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="camp-input"
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </Field>
          </div>

          <Field label="Address" htmlFor="address">
            <textarea
              id="address"
              required
              maxLength={250}
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 12/3, Temple Road, Colombo"
              className="camp-input"
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Parent / guardian name" htmlFor="parentsName">
              <input
                id="parentsName"
                required
                maxLength={100}
                value={parentsName}
                onChange={(e) => setParentsName(e.target.value)}
                placeholder="e.g. John"
                className="camp-input"
              />
            </Field>

            <Field label="Parent telephone" htmlFor="telephoneNumberOfParents">
              <input
                id="telephoneNumberOfParents"
                type="tel"
                required
                value={telephoneNumberOfParents}
                onChange={(e) => setTelephoneNumberOfParents(e.target.value)}
                placeholder="07X XXX XXXX"
                className="camp-input"
              />
            </Field>
          </div>

          <Field label="Religion" htmlFor="religion">
            <input
              id="religion"
              required
              maxLength={50}
              value={religion}
              onChange={(e) => setReligion(e.target.value)}
              placeholder="e.g. Christian"
              className="camp-input"
            />
          </Field>

          <Field label="Who invited you?" htmlFor="invitedBy">
            <input
              id="invitedBy"
              required
              maxLength={100}
              value={invitedBy}
              onChange={(e) => setInvitedBy(e.target.value)}
              placeholder="e.g. Mr. Silva"
              className="camp-input"
            />
          </Field>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-pine-700">
              Free days available
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                const checked = availableDays.includes(day);
                return (
                  <label
                    key={day}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                      checked ? 'border-ember-500 bg-ember-500/10 text-pine-900' : 'border-[#eee2c4] bg-white text-ink-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleDayToggle(day)}
                      className="h-4 w-4 rounded border-[#eee2c4] text-ember-500 focus:ring-ember-500"
                    />
                    <span>{day}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {status === 'error' && (
            <p role="alert" className="rounded-lg bg-ember-500/10 px-3 py-2 text-sm font-medium text-ember-600">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="mt-2 w-full rounded-full bg-red-800 py-3.5 font-display text-xl tracking-wide text-canvas-50 transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'submitting' ? 'Saving…' : 'Register Camper'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-xs font-bold uppercase tracking-wide text-pine-700">
        {label}
      </label>
      {children}
    </div>
  );
}
