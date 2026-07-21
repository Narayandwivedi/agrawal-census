import heroImg from '../hero (3).png';

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-fit md:min-h-[75vh] bg-[#FFF8F0] overflow-hidden">
      <img
        src={heroImg}
        alt=""
        className="w-full md:absolute md:inset-0 md:w-full md:h-full md:object-contain md:object-top"
      />
      <div className="hidden md:block relative z-10 w-full h-full" />
    </section>
  );
}
