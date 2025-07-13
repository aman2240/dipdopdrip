import React from 'react';
import { IoLogoInstagram } from 'react-icons/io';
import { RiTwitterXLine } from 'react-icons/ri';
import { TbBrandMeta } from 'react-icons/tb';

const Topbar = () => {
  return (
    <div className="bg-[#ea2e0e] text-white relative">
      <div className="container mx-auto py-3 px-4 flex items-center justify-between relative">
        {/* Social Icons */}
        <div className="hidden md:flex items-center space-x-4">
          <a href="#" className="hover:text-gray-300">
            <TbBrandMeta className="h-5 w-5" />
          </a>
          <a href="https://www.instagram.com/dipdopdrip" className="hover:text-gray-300">
            <IoLogoInstagram className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-gray-300">
            <RiTwitterXLine className="h-4 w-4" />
          </a>
        </div>

        {/* COD Warning - Centered Absolutely */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-sm font-medium">
          COD orders will incur an additional ₹50 handling fee!
        </div>
        {/* <div className="text-sm hidden md:block">
          <a href="tel:+1234567890" className="hover:text-gray-300">
            +1 (234) 567-890
          </a>
        </div> */}
      </div>
    </div>
  );
};

export default Topbar;
