import CampPosterBackground from '@/components/CampPosterBackground';
import RegistrationForm from '@/components/RegistrationForm';

export default function HomePage() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-pine-900 px-4 py-8 sm:px-6 lg:px-8">
      <CampPosterBackground />
      <div className="relative z-10 flex w-full max-w-6xl items-center justify-center">
        <div className="w-full max-w-md">
          <RegistrationForm />
        </div>
      </div>
    </main>
  );
}
