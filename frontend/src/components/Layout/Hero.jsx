import { Link } from "react-router-dom";

import heroImg from "../../assets/hero.png";

const Hero = () => {
  return ( <section className="relative">
    <img src={heroImg} alt="dip" className="w-full h-auto max-h-[90vh] mx-auto" />
    <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
      <div className=" text-center text-white p-6">
        <h1 className="text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4">
          Style
          <br />
          Limitless
        </h1>
        <p className="text-sm tracking-tighter md:text-lg mb-6">
          Explore our outfits combining style and comfort shipping all over india.
        </p>
        <Link to="/collections/all" className="bg-white text-gray-950 px-4 py-3 rounded-sm text-lg">Shop Now</Link>
      </div>
    </div>
  </section>
  );
};

export default Hero