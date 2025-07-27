import React, { useEffect } from "react";

const PrivacyPolicy = () => {
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">privacy policy</h1>

      <p className="mb-4">
        <strong>dipdopdrip</strong> (“we”, “our”, or “us”) operates the website <strong>www.dipdopdrip.in</strong> (the “Service”). This page outlines our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
      </p>

      <p className="mb-4">
        We are committed to protecting your privacy. By using our Service, you agree to the collection and use of information in accordance with this Privacy Policy.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. information we collect</h2>
      <p className="mb-4">
        When you use our Service, we may collect personally identifiable information including but not limited to your name, email address, phone number, shipping address, and payment details (“Personal Information”). This information is used to process orders, deliver services, provide support, and improve our offerings.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">2. usage data & log information</h2>
      <p className="mb-4">
        We may collect data that your browser sends whenever you visit our website. This may include your IP address, browser type and version, pages visited, time spent on pages, and other diagnostic data. We may also use third-party services like Google Analytics to track and analyze this information for service improvement.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. cookies & tracking</h2>
      <p className="mb-4">
        We use cookies and similar tracking technologies to monitor the activity on our website and store certain information. You can instruct your browser to refuse cookies, but this may affect some functionality of our Service.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">4. remarketing & advertising</h2>
      <p className="mb-4">
        We may use third-party vendors such as Google Ads for behavioral remarketing. These vendors may use cookies to serve ads based on your past visits to our site. You can opt out via your Google Ad Settings or install browser extensions like Google Analytics Opt-out.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">5. service providers</h2>
      <p className="mb-4">
        We may employ third-party companies to provide service-related assistance such as payment processing, analytics, or customer support. These parties only access your data to perform tasks on our behalf and are bound not to disclose or use it for other purposes.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">6. data security</h2>
      <p className="mb-4">
        We take the security of your data seriously and use commercially acceptable means to protect it. However, no transmission method over the internet is 100% secure, and we cannot guarantee absolute security.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">7. international transfer</h2>
      <p className="mb-4">
        If you are accessing our Service from outside India, please note that your data may be transferred to and processed in India. By submitting your personal data, you agree to this transfer.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">8. links to other websites</h2>
      <p className="mb-4">
        Our Service may contain links to external sites not operated by us. We strongly advise you to review the privacy policy of every site you visit. We are not responsible for the privacy practices of third-party services.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">9. children's privacy</h2>
      <p className="mb-4">
        Our Service does not address anyone under the age of 13. We do not knowingly collect personal information from children. If we learn that we have collected data from a child under 13, we will delete it immediately.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">10. changes to this policy</h2>
      <p className="mb-4">
        We may update our Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. Continued use of our Service after such updates constitutes your acknowledgment and agreement to the updated policy.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">11. contact us</h2>
      <p className="mb-4">
        If you have any questions or concerns regarding this Privacy Policy or how your information is handled, please contact us at:
      </p>
      <p className="font-medium">
        📧 <a href="mailto:dipdopdrip@gmail.com" className="text-blue-600 underline">dipdopdrip@gmail.com</a>
      </p>

      <p className="text-sm text-gray-500 mt-8 italic">
        Last updated: July 16, 2025
      </p>
    </div>
  );
};

export default PrivacyPolicy;
