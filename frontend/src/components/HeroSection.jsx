import heroImg from '../hero (3).png';

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[75vh] bg-[#FFF8F0] flex items-center justify-center overflow-hidden">
      <img
        src={heroImg}
        alt=""
        className="absolute inset-0 w-full h-full object-contain"
      />
      <div className="relative z-10 w-full h-full" />
    </section>
  );
}
