import React, { useEffect } from "react";

const ShippingPolicy = () => {
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">🚚 Shipping & Delivery Policy</h1>

      <p className="text-sm text-gray-500 mb-8 text-center">Last Updated: July 2025</p>

      <div className="space-y-6 text-[15px] leading-relaxed">
        <p>
          At <strong>DipDopDrip</strong>, we’re committed to delivering your oversized and anime-inspired styles with speed and care. Below is everything you need to know about how we ship your order.
        </p>

        <div>
          <h2 className="text-lg font-semibold mb-2">🕐 Order Processing</h2>
          <p>
            Orders are processed and dispatched <strong>within 1 business day</strong> after successful payment.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">📦 Estimated Delivery Time</h2>
          <p>
            Our standard delivery timeframe is <strong>7 to 10 business days</strong> after dispatch.
            Delivery may vary depending on your location or external conditions like festivals, weather, or courier delays.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">🚛 Shipping Partners</h2>
          <p>
            We ship through trusted logistics providers like <strong>Delhivery</strong>, <strong>Bluedart</strong>, and <strong>India Post</strong> to ensure safe and timely delivery.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">💸 Shipping Charges</h2>
          <p><strong>Shipping is 100% FREE</strong> on all orders. No hidden fees.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">📍 Tracking Your Order</h2>
          <p>
            As soon as your order is shipped, you will receive an email about order confirmation.
            If you face any issues, email us at <a href="mailto:dipdopdrip@gmail.com" className="text-blue-600 underline">dipdopdrip@gmail.com</a>.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">❌ Failed or Missed Deliveries</h2>
          <p>
            If a delivery fails due to incorrect details or unavailability, the package may be returned to us.
            We'll reach out to reschedule or initiate a refund if eligible.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">📬 Need Help?</h2>
          <p>
            For any shipping-related queries, feel free to contact us:
            <br />
            📧 <a href="mailto:dipdopdrip@gmail.com" className="text-blue-600 underline">dipdopdrip@gmail.com</a><br />
            📱 Instagram: <a href="https://instagram.com/dipdopdrip" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">@dipdopdrip</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
