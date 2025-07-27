import React from 'react';
import { IoLogoInstagram } from 'react-icons/io';
import { RiTwitterXLine } from 'react-icons/ri';
import { TbBrandMeta } from 'react-icons/tb';

const Topbar = () => {
  return (
    <div className="bg-[#ea2e0e] text-white text-xs sm:text-sm font-medium relative">
      <div className="container mx-auto px-4 py-2 flex flex-col sm:flex-row items-center sm:justify-start relative gap-1 sm:gap-0">
        
        {/* Social Icons - hidden on small screens */}
        <div className="hidden sm:flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3 w-full sm:w-auto">
          <a href="#" className="hover:text-gray-300" aria-label="Meta">
            <TbBrandMeta className="h-4 w-4" />
          </a>
          <a href="https://www.instagram.com/dipdopdrip" className="hover:text-gray-300" aria-label="Instagram">
            <IoLogoInstagram className="h-4 w-4" />
          </a>
          <a href="#" className="hover:text-gray-300" aria-label="Twitter">
            <RiTwitterXLine className="h-4 w-4" />
          </a>
        </div>

        {/* COD Warning */}
        <div className="text-center px-2 sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:top-1/2 sm:-translate-y-1/2 w-full sm:w-auto">
          Drip meets comfort in our oversized tees with anime and casual designs.
        </div>
      </div>
    </div>
  );
};

export default Topbar;
