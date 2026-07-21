import heroImg from '../hero (3).png';
import mobileHeroImg from '../agresen.png';

export default function HeroSection() {
  return (
    <section className="relative w-full md:min-h-[75vh] bg-[#FFF8F0] overflow-hidden">
      <img
        src={mobileHeroImg}
        alt=""
        className="w-full h-auto object-contain md:hidden"
      />
      <img
        src={heroImg}
        alt=""
        className="hidden md:block md:absolute md:inset-0 md:w-full md:h-full md:object-contain md:object-top"
      />
      <div className="hidden md:block relative z-10 w-full h-full" />
    </section>
  );
}
