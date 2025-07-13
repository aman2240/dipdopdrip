import { Link } from "react-router-dom";
import heroImg from "../../assets/hero.png";

const Hero = () => {
  return (
    <section className="relative">
      <img src={heroImg} alt="dip" className="w-full h-auto max-h-[90vh] mx-auto" />
      
      <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
        <div className="text-center text-white px-4 py-6">
          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-7xl lg:text-9xl font-bold tracking-tighter uppercase mb-3 sm:mb-4 leading-tight">
            Style
            <br />
            Limitless
          </h1>

          {/* Paragraph */}
          <p className="text-xs sm:text-sm md:text-base lg:text-lg mb-4 sm:mb-6 tracking-tight">
            Explore our outfits combining style and comfort shipping all over India.
          </p>

          {/* Button */}
          <Link
            to="/collections/all"
            className="bg-white text-gray-950 text-sm sm:text-base md:text-lg px-4 py-2 sm:px-5 sm:py-3 rounded-sm"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
