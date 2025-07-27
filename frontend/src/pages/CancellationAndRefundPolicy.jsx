import React, { useEffect } from "react";

const CancellationAndRefundPolicy = () => {
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">Cancellation & Refund Policy</h1>

      <p className="mb-4">
        At <strong>dipdopdrip</strong>, we aim to provide a smooth and satisfying shopping experience. Please read our cancellation and refund policy carefully to understand your rights and responsibilities as a customer.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. order cancellations</h2>
      <p className="mb-4">
        You can cancel your order within <strong>72 hours (3 days)</strong> of placing it. After this period, the order is likely to be in the processing or shipping stage and cannot be canceled. To request a cancellation:
      </p>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>Send an email to <strong>dipdopdrip@gmail.com</strong></li>
        <li>Use the subject line: <strong>Order Cancel</strong></li>
        <li>Include your <strong>Order ID</strong> in the email body</li>
      </ul>
      <p className="mb-4">
        Once we receive your request, we will process it within 24–48 hours and confirm the cancellation status. Refunds for canceled orders (if already paid) will be initiated back to the original payment method within 5–7 working days.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">2. return & refund policy</h2>
      <p className="mb-4">
        Returns or refunds are only eligible under the following conditions:
      </p>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>The product delivered is incorrect (wrong item or size)</li>
        <li>The product is received in damaged or defective condition</li>
      </ul>
      <p className="mb-4">
        We do not accept returns for reasons such as size mismatch (if the product matches the selected size), dislike of material, or change of mind.
      </p>
      <p className="mb-4">
        To request a return:
      </p>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>Email us at <strong>dipdopdrip@gmail.com</strong></li>
        <li>Use the subject line: <strong>Order Return</strong></li>
        <li>Include your <strong>Order ID</strong>, product image (if defective), and reason for return</li>
      </ul>
      <p className="mb-4">
        Our support team will review your request and respond within 2 business days. If approved, we will share the return instructions and process the refund within 5–7 business days after receiving the returned item.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. contact & support</h2>
      <p className="mb-4">
        For any questions related to cancellations or refunds, please reach out to us at <strong>dipdopdrip@gmail.com</strong>. We're here to help you.
      </p>

      <p className="text-sm text-gray-500 mt-8 italic">
        Note: dipdopdrip reserves the right to modify this policy at any time without prior notice. Please refer to this page periodically for the latest updates.
      </p>
    </div>
  );
};

export default CancellationAndRefundPolicy;
