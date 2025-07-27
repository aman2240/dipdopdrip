import React from 'react';
import { HiOutlineCreditCard, HiShoppingBag } from 'react-icons/hi';
import { HiArrowPathRoundedSquare } from 'react-icons/hi2';

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center text-center gap-8">
          {/* Feature 1 */}
          <div className="w-full sm:w-1/3 flex flex-col items-center">
            <div className="p-4 rounded-full bg-gray-100 mb-4">
              <HiShoppingBag className="text-2xl text-gray-700" />
            </div>
            <h4 className="text-sm font-semibold tracking-tighter mb-1 uppercase">
              Free Shipping
            </h4>
            <p className="text-gray-600 text-sm tracking-tight">
              On all orders
            </p>
          </div>

          {/* Feature 2 */}
          <div className="w-full sm:w-1/3 flex flex-col items-center">
            <div className="p-4 rounded-full bg-gray-100 mb-4">
              <HiArrowPathRoundedSquare className="text-2xl text-gray-700" />
            </div>
            <h4 className="text-sm font-semibold tracking-tighter mb-1 uppercase">
              Order Return Policy
            </h4>
            <p className="text-gray-600 text-sm tracking-tight">
              Return only if wrong or defective item received
            </p>
          </div>

          {/* Feature 3 */}
          <div className="w-full sm:w-1/3 flex flex-col items-center">
            <div className="p-4 rounded-full bg-gray-100 mb-4">
              <HiOutlineCreditCard className="text-2xl text-gray-700" />
            </div>
            <h4 className="text-sm font-semibold tracking-tighter mb-1 uppercase">
              Secure Checkout
            </h4>
            <p className="text-gray-600 text-sm tracking-tight">
              100% secured checkout process
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
