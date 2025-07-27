import React, { useEffect } from 'react';

const ContactUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="bg-gray-50 p-8 rounded-xl shadow-md max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-black mb-4 font-poppins">Contact Us</h1>
        <p className="text-gray-700 font-poppins mb-6">
          Got questions about your order, returns, or sizing? Reach out to us!
        </p>

        <div className="text-left space-y-4 text-gray-800 font-poppins text-sm">
          <div>
            <span className="font-semibold">Email:</span> dipdopdrip@gmail.com
          </div>
          <p className="text-gray-700 font-poppins mb-6">You can email us for tracking your order or any other inquiries.</p>
          <div>
            <span className="font-semibold">Phone:</span> +91 76671 32240
          </div>
          <div>
            <span className="font-semibold">Instagram:</span>{' '}
            <a
              href="https://instagram.com/dipdopdrip"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              @dipdopdrip
            </a>
          </div>
          <div>
            <span className="font-semibold">Customer Support Hours:</span> Mon–Sat, 10AM – 6PM IST
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
