import React, { useState } from "react";
import { FiPhoneCall } from "react-icons/fi";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";
import { AnimatePresence } from "framer-motion";
import InfoModal from "../InfoModal";
import { toast } from "sonner";
import axios from "axios";
import { Link } from "react-router-dom"; // ⬅️ make sure this is included

const Footer = () => {
  const [modalInfo, setModalInfo] = useState({ show: false, title: "", content: "" });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter an email address.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post("/api/subscribe", { email });
      toast.success(data.message);
      setEmail("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Subscription failed");
    } finally {
      setLoading(false);
    }
  };

  const handleShow = (title, content) => {
    setModalInfo({ show: true, title, content });
  };

  const handleClose = () => {
    setModalInfo({ show: false, title: "", content: "" });
  };

  return (
    <>
      <footer className="border-t border-gray-200 py-12 bg-white">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 lg:px-0">

          {/* Newsletter - Left */}
          <div className="flex flex-col justify-between h-full text-left md:text-left md:items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Newsletter</h3>
              <p className="text-gray-500 mb-4">
                Be the first to know about new products, exclusive events, and online offers.
              </p>
              <p className="font-medium text-sm text-gray-600 mb-6">
                Sign up and get notifications about our brand updates.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-3 md:gap-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="p-3 w-full text-m border border-gray-300 rounded-md md:rounded-l-md md:rounded-r-none focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-black text-white px-6 py-3 rounded-md md:rounded-r-md md:rounded-l-none hover:bg-gray-800 transition-all ${
                    loading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Signing Up..." : "SignUp"}
                </button>
              </form>
            </div>
          </div>

          {/* Support Links - Center */}
          <div className="flex flex-col justify-between h-full text-left md:text-center md:items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Support Links</h3>
              <ul className="space-y-2 text-left text-gray-600">
                <li>
                  <button
                    onClick={() =>
                      handleShow(
                        "Contact Us",
                        "📧 dipdopdrip@gmail.com\n📱 WhatsApp: Coming soon!\n📷 Instagram: @dipdopdrip"
                      )
                    }
                    className="hover:text-indigo-500 transition-colors"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      handleShow(
                        "About Us",
                        "DipDopDrip is a brand born from the love of effortless style and anime culture. We blend comfort, casual fits, and bold aesthetics to craft apparel that resonates with everyday dreamers and die-hard anime fans alike.\n\nOur collections are designed to be relaxed, wearable, and expressive, offering oversized tees and casual essentials that speak your vibe — whether you're chilling at home, heading out with friends, or making a statement online.\n\nAt DipDopDrip, we don’t just sell clothes — we deliver a feeling. A blend of drip and dopamine, tailored for fans of comfort, creativity, and character."
                      )
                    }
                    className="hover:text-indigo-500 transition-colors"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      handleShow(
                        "FAQs",
                        "❓ Q: How can I track my order?\n✔️ A: Email us at dipdopdrip@gmail.com and we will respond ASAP.\n\n❓ Q: Return policy?\n✔️ A: 3-day easy returns available."
                      )
                    }
                    className="hover:text-indigo-500 transition-colors"
                  >
                    FAQs
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      handleShow(
                        "Features",
                        "✨ Free Shipping on every order\n✨ 3-Day Returns\n✨  Eco-friendly Packaging"
                      )
                    }
                    className="hover:text-indigo-500 transition-colors"
                  >
                    Features
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Follow Us - Right */}
          <div className="flex flex-col justify-between h-full md:px-20 md:items-start">
            <div className="w-full md:w-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-left md:text-left">
                Follow Us
              </h3>
              <div className="flex justify-start space-x-4 mb-6 text-gray-600">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
                  <TbBrandMeta className="h-6 w-6" />
                </a>
                <a href="https://www.instagram.com/dipdopdrip" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
                  <IoLogoInstagram className="h-6 w-6" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
                  <RiTwitterXLine className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6 text-center">
          <p className="text-gray-600 text-sm tracking-tighter">
            © 2025 dipdopdrip. All Rights Reserved
          </p>
          <div className="flex justify-center gap-x-4 mt-2">
  <Link to="/contact" className="text-sm text-gray-600 hover:text-black underline">
    Contact Us
  </Link>
  <Link to="/shipping-policy" className="text-sm text-gray-600 hover:text-black underline">
    Shipping Policy
  </Link>
  <Link to="/terms-and-conditions" className="text-sm text-gray-600 hover:text-black underline">
    Terms & Conditions
  </Link>
  <Link to="/cancellation-policy" className="text-sm text-gray-600 hover:text-black underline">
    Cancellation & Refund Policy
  </Link>
  <Link to="/privacy-policy" className="text-sm text-gray-600 hover:text-black underline">
    Privacy Policy
  </Link>

</div>

        </div>
      </footer>

      {/* Info Modal */}
      <AnimatePresence>
        {modalInfo.show && (
          <InfoModal title={modalInfo.title} content={modalInfo.content} onClose={handleClose} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Footer;
