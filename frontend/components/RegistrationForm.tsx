'use client';

import { FormEvent, useState } from 'react';
import { registerCamper } from '@/lib/api';
import { AREAS, AreaValue } from '@/lib/types';

const PENNANT_COLORS = ['#E8743B', '#F4B942', '#3D7257', '#E8743B', '#F4B942', '#3D7257', '#E8743B'];

type Status = 'idle' | 'submitting' | 'success' | 'error';

type ConfirmationLanguage = 'tamil' | 'sinhala';

const CONFIRMATION_COPY: Record<ConfirmationLanguage, { greeting: string; paragraphs: string[]; closing: string; signature: string }> = {
  tamil: {
    greeting: 'கனம் பெற்றோர் / பாதுகாவலருக்கு,',
    paragraphs: [
      'கிறிஸ்துவுக்காக இளைஞர் நிறுவனமானது அரச சார்பற்ற மற்றும் இலாப நோக்கமற்ற ஓர் கிறிஸ்தவ நிறுவனமாகும். இந் நிறுவனத்தின் மூலம் நாம் இளைஞர்களின் உடல், உள, ஆன்மிக ரீதியில் தாக்கத்தை ஏற்படுத்தி அவர்களை சிறந்த தலைவர்களாகாக்குவது எமது நோக்கமாகும்.',
      'இந் நிறுவனத்தின் ஒரு பிரிவான பாடசாலை ஊழியமானது பாடசாலை மாணவர்களின் கல்வி சார்பான பல நடவடிக்கைகளில் ஈடுபடுகிறது. அவர்களுடைய உடல், உள மற்றும் ஆன்மிக வாழ்வியலை விருத்தி செய்யும் பொருட்டும் நல் விழுமியங்களை கற்றுக்கொடுக்கும் நோக்குடனும் இம் முகாமானது ஏற்பாடு செய்யப்பட்டுள்ளது.',
      'இம் முகாமானது ஆகஸ்ட் மாதம் 25ம் திகதி தொடக்கம் 28ம் திகதி வரை மாதம்பே பிரதேசத்தில் ஏற்பாடு செய்யப்பட்டுள்ளது. இந்த நாட்களில் பங்கு கொள்ளும் மாணவர்களின் பாதுகாப்பை நாங்கள் முழுமையாக உறுதிப்படுத்துகிறோம்.',
      'அத்தோடு இது தொடர்பான மேலதிக தகவல்களை பெற்றுக்கொள்ள எங்களை தொடர்புகொள்ளுமாறு கேட்டுக்கொள்வதோடு அவர்களின் வருகையை உறுதிப்படுத்துமாறும் தாழ்மையோடு கேட்டுக்கொள்கிறோம்.',
    ],
    closing: 'இப்படிக்கு,',
    signature: 'P.அருள் பிரகாஷ்\n(பாடசாலை ஊழிய இயக்குனர்)',
  },
  sinhala: {
    greeting: 'ගරු මව්පියන් / භාරකරුවන් වෙත,',
    paragraphs: [
      'ක්‍රිස්තුස්වහන්සේ සඳහා වන යෞවන ආයතනය යනු රජයේ නොවන සහ ලාභ නොලබන ක්‍රිස්තියානි ආයතනයකි. මෙම ආයතනය හරහා අපි තරුණ තරුණියන්ගේ ශාරීරික, මානසික සහ අධ්‍යාත්මික තත්ත්වයන් වර්ධනය කරමින් ඔවුන් විශිෂ්ට නායකයන් බවට පත් කිරීම අපගේ අරමුණ වේ.',
      'මෙම ආයතනයේ පාසල් සේවය නම් අංශය පාසල් සිසුන්ගේ අධ්‍යාපනයට අදාළ බොහෝ ක්‍රියාකාරකම්වල නිරත වේ. ඔවුන්ගේ ශාරීරික, මානසික සහ අධ්‍යාත්මික ජීවිත සංවර්ධනය කිරීමේ අරමුණින් සහ යහපත් වටිනාකම් උගන්වමින් මෙම කඳවුර සංවිධානය කර ඇත.',
      'මෙම කඳවුර අගෝස්තු මස 25වන දින සිට 28වන දින දක්වා Madampe ප්‍රදේශයේදී පැවැත්වේ. මෙම දිනවලදී සහභාගී වන සිසුන්ගේ ආරක්ෂාව අපි සම්පූර්ණයෙන්ම තහවුරු කරමු.',
      'එසේම, මේ පිළිබඳ වැඩිදුර තොරතුරු ලබා ගැනීම සඳහා අප හා සම්බන්ධ වන ලෙසත්, ඔවුන්ගේ පැමිණීම තහවුරු කරන ලෙසත් කාරුණිකව ඉල්ලමු.',
    ],
    closing: 'මෙයට,',
    signature: 'පී. අරුල් ප්‍රකාශ්\n(පාසල් සේවා අධ්‍යක්ෂ)',
  },
};

const CONFIRMATION_ACK_COPY: Record<ConfirmationLanguage, string> = {
  tamil: 'எனது மகன் / மகள் இம் முகாமிற்கு செல்ல அனுமதியளிக்கிறேன்.',
  sinhala: 'මගේ පුතා / දියණිය මෙම කඳවුරට යාමට අවසර දෙමි.',
};

const CAMP_FEE = 'Rs. 3,000';
const CAMP_DATES = 'August 25 – 28';
const CAMP_LOCATION = 'Madampe';
const THINGS_TO_BRING = [
  'National Identity Card / Birth Certificate copy',
  'Bedsheet, pillow & mosquito net',
  'Personal toiletries & towel',
  'Water bottle & torch',
  'Bible & notebook',
  'Medication (if any) with instructions',
];
const DRESS_CODE = 'Modest, comfortable casual wear. White t-shirt required for the closing day.';
const WHATSAPP_LINK = 'https://chat.whatsapp.com/HAS9I5ITZ5TDmk0XVawAjS';

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
  const [medicalConditions, setMedicalConditions] = useState('');
  const [invitedBy, setInvitedBy] = useState('');
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [confirmationLanguage, setConfirmationLanguage] = useState<ConfirmationLanguage | ''>('');
  const [parentAcknowledged, setParentAcknowledged] = useState(false);
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
    setMedicalConditions('');
    setInvitedBy('');
    setAvailableDays([]);
    setConfirmationLanguage('');
    setParentAcknowledged(false);
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
        medicalConditions: medicalConditions.trim(),
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
      <div className="rise-in relative z-10 w-full max-w-md rounded-2xl bg-canvas-50 p-8 shadow-canvas">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pine-700 text-canvas-50">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path d="M5 12.5 10 17 19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="font-display text-3xl text-pine-900">You&apos;re on the list!</h2>
          <p className="mt-2 text-ink-700">The camper is registered. See you at camp!</p>
        </div>

        <div className="mt-6 space-y-4 text-left">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#eee2c4] bg-white px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wide text-pine-700">Camp fee</p>
              <p className="mt-1 font-display text-xl text-pine-900">{CAMP_FEE}</p>
            </div>
            <div className="rounded-xl border border-[#eee2c4] bg-white px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wide text-pine-700">Camp dates</p>
              <p className="mt-1 font-display text-xl text-pine-900">{CAMP_DATES}</p>
              <p className="text-xs text-ink-700">{CAMP_LOCATION}</p>
            </div>
          </div>

          <div className="rounded-xl border border-[#eee2c4] bg-white px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-pine-700">Things to bring</p>
            <ul className="mt-2 space-y-1 text-sm text-ink-700">
              {THINGS_TO_BRING.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-ember-600">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-[#eee2c4] bg-white px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-pine-700">Dress code</p>
            <p className="mt-1 text-sm text-ink-700">{DRESS_CODE}</p>
          </div>

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full bg-pine-700 py-3 font-semibold text-canvas-50 transition hover:bg-pine-800"
          >
            Join our WhatsApp community
          </a>
        </div>

        <button
          onClick={() => setStatus('idle')}
          className="mt-6 w-full rounded-full bg-ember-500 px-6 py-3 font-semibold text-canvas-50 transition hover:bg-ember-600"
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

          <Field label="Medical conditions" htmlFor="medicalConditions">
            <textarea
              id="medicalConditions"
              maxLength={250}
              rows={3}
              value={medicalConditions}
              onChange={(e) => setMedicalConditions(e.target.value)}
              placeholder="e.g. wheeze, asthma, allergies, ongoing medication, or None"
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
              Free days available for the weekly meet-up
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                const checked = availableDays.includes(day);
                return (
                  <label
                    key={day}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${checked ? 'border-ember-500 bg-ember-500/10 text-pine-900' : 'border-[#eee2c4] bg-white text-ink-700'
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

          <div className="rounded-2xl border border-[#eee2c4] bg-white px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-pine-700">
                  Parent confirmation acknowledgment
                </p>
                <p className="mt-1 text-sm text-ink-700">
                  Select either Tamil or Sinhala, then confirm that you have read and accepted the camp terms.
                </p>
              </div>
              <span className="rounded-full bg-ember-500/10 px-3 py-1 text-xs font-semibold text-ember-700">
                Required
              </span>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <label
                className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${confirmationLanguage === 'tamil'
                  ? 'border-ember-500 bg-ember-500/10 text-pine-900'
                  : 'border-[#eee2c4] bg-canvas-50 text-ink-700'
                  }`}
              >
                <input
                  type="radio"
                  name="confirmationLanguage"
                  value="tamil"
                  required
                  checked={confirmationLanguage === 'tamil'}
                  onChange={() => setConfirmationLanguage('tamil')}
                  className="h-4 w-4 border-[#eee2c4] text-ember-500 focus:ring-ember-500"
                />
                <span>Tamil</span>
              </label>

              <label
                className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${confirmationLanguage === 'sinhala'
                  ? 'border-ember-500 bg-ember-500/10 text-pine-900'
                  : 'border-[#eee2c4] bg-canvas-50 text-ink-700'
                  }`}
              >
                <input
                  type="radio"
                  name="confirmationLanguage"
                  value="sinhala"
                  required
                  checked={confirmationLanguage === 'sinhala'}
                  onChange={() => setConfirmationLanguage('sinhala')}
                  className="h-4 w-4 border-[#eee2c4] text-ember-500 focus:ring-ember-500"
                />
                <span>Sinhala</span>
              </label>
            </div>

            <div className="mt-4 space-y-3 rounded-xl bg-canvas-50 px-4 py-4 text-sm leading-relaxed text-ink-700">
              {confirmationLanguage ? (
                <>
                  <p className="font-semibold text-pine-900">{CONFIRMATION_COPY[confirmationLanguage].greeting}</p>
                  {CONFIRMATION_COPY[confirmationLanguage].paragraphs.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                  <p>{CONFIRMATION_COPY[confirmationLanguage].closing}</p>
                  <p className="whitespace-pre-line font-semibold text-pine-900">
                    {CONFIRMATION_COPY[confirmationLanguage].signature}
                  </p>
                </>
              ) : (
                'Choose a language above to view the parent confirmation text.'
              )}
            </div>

            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-[#eee2c4] bg-canvas-50 px-4 py-3 text-sm text-ink-700">
              <input
                type="checkbox"
                required
                checked={parentAcknowledged}
                onChange={(e) => setParentAcknowledged(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-[#eee2c4] text-ember-500 focus:ring-ember-500"
              />
              <span>
                {confirmationLanguage
                  ? CONFIRMATION_ACK_COPY[confirmationLanguage]
                  : 'Select Tamil or Sinhala to view the acknowledgment tick text.'}
              </span>
            </label>
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