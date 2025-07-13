import React from 'react';
import { IoLogoInstagram } from 'react-icons/io';
import { RiTwitterXLine } from 'react-icons/ri';
import { TbBrandMeta } from 'react-icons/tb';

const Topbar = () => {
  return (
    <div className="bg-[#ea2e0e] text-white text-xs sm:text-sm font-medium">
      <div className="container mx-auto px-4 py-2 flex flex-col items-center justify-center sm:flex-row sm:justify-between gap-1 sm:gap-0">
        
        {/* Social Icons - Centered */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-3">
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

        {/* COD Warning - Below on mobile, right side on larger screens */}
        <div className="text-center px-2">
          COD orders will incur an additional ₹50 handling fee!
        </div>
      </div>
    </div>
  );
};

export default Topbar;
