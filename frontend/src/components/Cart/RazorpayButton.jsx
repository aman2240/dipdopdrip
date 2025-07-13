import React from "react";

const RazorpayButton = ({ amount, onSuccess, onError, checkoutId }) => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleClick = async () => {
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      console.error("Razorpay SDK failed to load.");
      return onError?.("Razorpay SDK failed to load.");
    }

    try {
      if (!amount || amount <= 0) {
        throw new Error("Invalid amount specified for payment");
      }

      const res = await fetch("http://localhost:9000/api/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          checkoutId,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Order creation failed");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "YOUR_PUBLIC_KEY",
        amount: data.amount,
        currency: "INR",
        name: "My Store",
        description: "Test Transaction",
        order_id: data.id,
        handler: function (response) {
          onSuccess?.(response);
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#000000",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay init failed", err);
      onError?.(err);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
    >
      Pay Now
    </button>
  );
};

export default RazorpayButton;
