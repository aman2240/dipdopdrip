import React, { useEffect } from "react";
import { motion , AnimatePresence } from "framer-motion";

const InfoModal = ({ title, content, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm">
      <motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.9 }}
  transition={{ duration: 0.2 }}
  className="bg-gray-50 text-gray-800 w-[90%] max-w-2xl h-[80vh] sm:h-[70vh] md:h-[600px] rounded-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden font-sans"
>
  <h2 className="text-xl sm:text-2xl font-semibold mb-4 border-b border-gray-300 pb-2">
    {title}
  </h2>
  <div className="text-sm sm:text-base leading-relaxed whitespace-pre-line overflow-y-auto max-h-[calc(100%-80px)] pr-2">
    {content}
  </div>
  <button
    onClick={onClose}
    className="absolute top-3 right-4 text-gray-700 hover:text-red-500 text-2xl sm:text-3xl font-bold"
  >
    &times;
  </button>
</motion.div>

    </div>
  );
};

export default InfoModal;
