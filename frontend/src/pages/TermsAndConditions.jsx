import React, { useEffect } from "react";

const TermsAndConditions = () => {
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">Terms & Conditions</h1>

      <p className="mb-4">
        Welcome to <strong>dipdopdrip</strong>. These terms and conditions ("terms") govern your access to and use of our website, <strong>www.dipdopdrip.in</strong>, including all purchases made through the site. By using our website, you agree to be bound by these terms. If you do not agree with any part of them, please refrain from using our service.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. acceptance of terms</h2>
      <p className="mb-4">
        By using our website and services, you confirm that you are at least 18 years old or are using the site under the supervision of a parent or legal guardian. These terms apply to all visitors, users, and customers who access or use any part of our site. We reserve the right to change or modify any of the terms and conditions at any time, with or without notice. Continued use of the website implies acceptance of any updated terms.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">2. orders & payments</h2>
      <p className="mb-4">
        When placing an order on dipdopdrip, you agree to provide accurate, current, and complete purchase and account information. We accept payments via major credit cards, debit cards, UPI, and other supported methods. All transactions are encrypted and secure. We reserve the right to cancel or refuse any order for any reason including, but not limited to, product availability, pricing errors, or suspected fraud.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. shipping & delivery</h2>
      <p className="mb-4">
        Orders are usually processed within 24 hours of confirmation. Standard delivery times range from 7 to 10 business days depending on your location. You will receive tracking information once your order is shipped. While we strive to meet delivery timelines, we are not responsible for delays caused by courier services or external factors such as weather, festivals, or strikes.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">4. returns & exchanges</h2>
      <p className="mb-4">
        We accept returns only if the delivered product is defective or incorrect and you are asked to make a video of unboxing the product. To be eligible, the item must be unused, unwashed, and in original packaging. Once we receive the item and inspect its condition, we will process a refund or exchange as applicable. Email <strong>dipdopdrip@gmail.com</strong> to initiate a return.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">5. intellectual property</h2>
      <p className="mb-4">
        All designs, logos, product images, graphics, and written content on this website are the intellectual property of dipdopdrip. No part of the site may be reproduced, copied, or reused for commercial purposes without our explicit written permission. We take infringement seriously and will take legal action when necessary.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">6. user responsibilities</h2>
      <p className="mb-4">
        As a user of dipdopdrip, you agree not to misuse the site or engage in any activity that could harm the platform, such as hacking, transmitting malware, or abusing other users. You are responsible for any activity that occurs under your account. Providing false information, attempting unauthorized access, or violating any law or regulation while using our site may lead to account suspension or legal action.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">7. limitation of liability</h2>
      <p className="mb-4">
        dipdopdrip and its affiliates shall not be held liable for any indirect, incidental, special, or consequential damages resulting from your use or inability to use our site or services. This includes but is not limited to loss of profits, data, or business interruptions. Our liability is limited to the amount paid by you for the specific product or service.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">8. changes to terms</h2>
      <p className="mb-4">
        We may update these terms periodically to reflect changes in our policies or legal obligations. You are encouraged to review this page occasionally. We will notify you of major changes either through email or a prominent notice on the website. Continued use of our site following the posting of changes will signify your acceptance of those changes.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">9. third-party links</h2>
      <p className="mb-4">
        Our website may include links to third-party websites for convenience or promotional purposes. We do not control or endorse these sites, and we are not responsible for their content, policies, or practices. Use them at your own discretion and review their terms before interacting with them.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">10. governing law</h2>
      <p className="mb-4">
        These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes related to our website or services shall be subject to the jurisdiction of the courts in Delhi, India.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">11. contact us</h2>
      <p className="mb-4">
        For any questions, concerns, or feedback regarding these terms, please reach out to us at <strong>dipdopdrip@gmail.com</strong>. We value transparency and will respond as soon as possible.
      </p>
    </div>
  );
};

export default TermsAndConditions;
