import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import RazorpayButton from "./RazorpayButton";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout } from "../../redux/slices/checkoutSlice";
import axios from "axios";


const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState(null);
  const [isCODLoading, setIsCODLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("razorpay");
  const [isFinalizing, setIsFinalizing] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastname: "",
    address: "",
    city: "",
    postalCode: "",
    province: "",
    country: "India",
    phone: "",
  });

  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const totalAmount = selectedPaymentMethod === "cod" ? cart.totalPrice + 50 : cart.totalPrice;

  const handleCreateCheckout = async (e) => {
    e.preventDefault();

    const countryMap = {
      India: "IN",
      "United States": "US",
      "United Kingdom": "GB",
      Canada: "CA",
      Australia: "AU",
    };
    const countryCode = countryMap[shippingAddress.country] || "IN";

    const checkoutItems = cart.products.map((p) => ({
      productId: p.productId,
      name: p.name,
      size: p.size || p.variant?.size,
      color: p.color || p.variant?.color,
      price: p.discountPrice ?? p.price,
      image: p.variantImage || p.image,
      variantImage: p.variantImage || p.image,
      sku: p.sku,
      quantity: p.quantity || 1,
      searchFromMyProducts: p.searchFromMyProducts ?? p.search_from_my_products ?? 1,
      printTypeId: p.printTypeId || 1,
      designs: p.designs || [],
    }));

    const payload = {
      checkoutItems,
      shippingAddress: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        province: shippingAddress.province || "TN",
        country: shippingAddress.country,
        countryCode,
        phone: shippingAddress.phone,
      },
      paymentMethod: selectedPaymentMethod,
      totalPrice: totalAmount,
    };

    try {
      const res = await dispatch(createCheckout(payload)).unwrap();
      if (res && res._id) {
        setCheckoutId(res._id);
      }
    } catch (error) {
      console.error("Checkout creation failed", error);
      alert("Checkout failed: " + (error.message || "Unknown error"));
    }
  };

  const handlePaymentSuccess = async (razorpayData) => {
    const token = localStorage.getItem("userToken");
    if (!token || token === "undefined" || token === "null") {
      alert("You're not logged in. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const verifyRes = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/razorpay/verify`,
        {
          razorpay_order_id: razorpayData.razorpay_order_id,
          razorpay_payment_id: razorpayData.razorpay_payment_id,
          razorpay_signature: razorpayData.razorpay_signature,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!verifyRes.data.success) throw new Error("Verification failed");

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: "paid",
          paymentDetails: razorpayData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await handleFinalizeCheckout(checkoutId);
    } catch (error) {
      console.error("Payment verification or update failed", error);
      alert("Payment failed. Try again.");
    }
  };

  const handleCODPayment = async () => {
    if (!checkoutId) return;

    const token = localStorage.getItem("userToken");
    if (!token || token === "undefined" || token === "null") {
      alert("You're not logged in. Please login again.");
      navigate("/login");
      return;
    }

    setIsCODLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: "paid",
          paymentDetails: { method: "COD" },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await handleFinalizeCheckout(checkoutId);
    } catch (err) {
      console.error("COD payment failed", err);
      if (err.response?.data?.message) {
        alert("COD payment failed: " + err.response.data.message);
      } else {
        alert("COD payment failed. Try again.");
      }
    } finally {
      setIsCODLoading(false);
    }
  };

  const handleFinalizeCheckout = async (checkoutId) => {
  const token = localStorage.getItem("userToken");
  if (!token || token === "undefined" || token === "null") {
    alert("You're not logged in. Please login again.");
    navigate("/login");
    return;
  }

  setIsFinalizing(true);

  try {
    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    navigate("/order-confirmation");
  } catch (error) {
    console.error("Finalize error", error);
    if (error.response) {
      alert("Finalize failed: " + error.response.data.message);
    } else {
      alert("Finalize failed: Unknown error");
    }
  } finally {
    setIsFinalizing(false);
  }
};


  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!cart || !cart.products || cart.products.length === 0) return <p>Your cart is empty</p>;

  return (
    <div className="checkout-page">
    {/* Loader Overlay */}
    {isFinalizing && (
  <div className="fixed inset-0 bg-gray-300/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-lg">
      <p className="text-lg">Please wait, finalizing your order…</p>
    </div>
  </div>
)}

    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>
        {/* Your form logic should go here */}
        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-4">Contact Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input type="email" value={user ? user.email : ""} className="w-full p-2 border rounded" disabled />
          </div>

          <h3 className="text-lg mb-4">Delivery</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                value={shippingAddress.firstName}
                onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                value={shippingAddress.lastname}
                onChange={(e) => setShippingAddress({ ...shippingAddress, lastname: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Postal Code</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">State / Province</label>
              <input
                type="text"
                value={shippingAddress.province}
                onChange={(e) => setShippingAddress({ ...shippingAddress, province: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Country</label>
              <input
                type="text"
                value={shippingAddress.country}
                onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Mobile no.</label>
            <input
              type="tel"
              value={shippingAddress.phone}
              onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <h3 className="text-lg mb-4">Choose Payment Method</h3>
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setSelectedPaymentMethod("razorpay")}
              className={`px-4 py-2 rounded border w-full ${selectedPaymentMethod === "razorpay" ? "bg-black text-white" : "bg-white border-gray-300"}`}
            >
              Razorpay
            </button>
            <button
              type="button"
              onClick={() => setSelectedPaymentMethod("cod")}
              className={`px-4 py-2 rounded border w-full ${selectedPaymentMethod === "cod" ? "bg-yellow-600 text-white" : "bg-white border-gray-300"}`}
            >
              Cash on Delivery
            </button>
          </div>

          <div className="mt-6">
            {!checkoutId ? (
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded transition duration-300 hover:bg-gray-800"
              >
                Continue to Payment
              </button>
            ) : (
              <div>
                {selectedPaymentMethod === "razorpay" && (
                  <RazorpayButton
                    amount={totalAmount}
                    onSuccess={handlePaymentSuccess}
                    onError={() => alert("Payment failed. Try again")}
                    checkoutId={checkoutId}
                  />
                )}
                {selectedPaymentMethod === "cod" && (
                  <button
                    onClick={handleCODPayment}
                    disabled={isCODLoading}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded flex justify-center items-center mt-4"
                  >
                    {isCODLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                          <path fill="white" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      `Pay ₹${totalAmount} with COD`
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </form>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
  <h3 className="text-lg mb-4 font-semibold">Order Summary</h3>
  <div className="space-y-4 mb-6">
    {cart.products.map((product, index) => {
      const color = product.color || product.variant?.color || "";
      const imagesObj = product.images instanceof Map
        ? Object.fromEntries(product.images)
        : product.images || {};

      const matchedColorKey = Object.keys(imagesObj).find(
        (key) => key.toLowerCase() === color.toLowerCase()
      );

      const selectedImages = matchedColorKey ? imagesObj[matchedColorKey] : [];
      const imageUrl = selectedImages?.[0] || product.image || product.variantImage || "";

      return (
        <div
          key={index}
          className="flex justify-between items-center border p-3 rounded-lg bg-white shadow-sm"
        >
          <div className="flex gap-4 items-center">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-24 h-24 object-cover rounded-md border"
            />
            <div>
  <p className="font-medium">{product.name}</p>
  <p className="text-sm text-gray-500">
    Size: {product.size || product.variant?.size} | Color: {color}
  </p>
  <p className="text-sm text-gray-500">Quantity: {product.quantity || 1}</p>
</div>

          </div>
          <div className="text-right font-semibold text-sm min-w-[60px]">
            ₹{product.discountPrice.toLocaleString()}
          </div>
        </div>
      );
    })}
  </div>

  <div className="flex justify-between text-lg mb-4">
    <p>Subtotal</p>
    <p>₹{cart.totalPrice?.toLocaleString()}</p>
  </div>
  <div className="flex justify-between text-lg mb-4">
    <p>Shipping</p>
    <p>Free</p>
  </div>
  {selectedPaymentMethod === "cod" && (
    <div className="flex justify-between text-lg mb-2">
      <p>COD Fee</p>
      <p>₹50</p>
    </div>
  )}
  <div className="flex justify-between text-lg mt-4 border-t pt-4 font-semibold">
    <p>Total</p>
    <p>₹{totalAmount.toLocaleString()}</p>
  </div>
</div>

    </div>
    </div>
  );
};

export default Checkout;
