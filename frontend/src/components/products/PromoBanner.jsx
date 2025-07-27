import React from "react";
import { FaRegCopy } from "react-icons/fa";

const PromoBanner = () => {
  const promoCode = "DRIP100";

  const handleCopy = () => {
    navigator.clipboard.writeText(promoCode);
    alert("Promo code copied!");
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">
      <div className="relative rounded-xl bg-yellow-50 text-gray-900 border border-yellow-100 p-6 md:p-8 shadow-lg flex flex-col items-center text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          ₹100 OFF Your Order!
        </h2>
        <p className="text-gray-700 text-sm md:text-base mb-4">
          Use the promo code below at checkout to instantly save ₹100 on your total.
        </p>

        <div className="flex items-center justify-center gap-3">
          <span className="text-lg md:text-xl font-mono bg-white text-yellow-700 px-4 py-2 rounded-md tracking-wider border border-yellow-300 shadow">
            {promoCode}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center text-sm text-yellow-600 hover:text-yellow-800 transition"
          >
            <FaRegCopy className="mr-1" /> Copy
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-400 italic">
          Valid for a limited time. Apply at checkout.
        </p>
      </div>
    </div>
  );
};

export default PromoBanner;
