import Image from 'next/image';

export default function CampPosterBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#123426]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_55%)]" />
      <Image
        src="/camp.png"
        alt=""
        fill
        priority
        className="object-cover object-center opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f261d]/80 via-[#0f261d]/35 to-[#0f261d]/80" />
    </div>
  );
}
