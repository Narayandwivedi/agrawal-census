import heroImg from '../new hero.avif';
import mobileHeroImg from '../new agresen.avif';

export default function HeroSection() {
  return (
    <section className="relative w-full bg-[#FFF8F0] leading-none">
      <img
        src={mobileHeroImg}
        alt=""
        className="w-full h-auto object-contain md:hidden"
      />
      <img
        src={heroImg}
        alt=""
        className="hidden md:block w-full h-auto object-contain"
      />
    </section>
  );
}
