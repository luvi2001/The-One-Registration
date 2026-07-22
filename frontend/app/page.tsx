import CampPosterBackground from '@/components/CampPosterBackground';
import RegistrationForm from '@/components/RegistrationForm';

export default function HomePage() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-pine-900 px-4 py-10">
      <CampPosterBackground />
      <RegistrationForm />
    </main>
  );
}
