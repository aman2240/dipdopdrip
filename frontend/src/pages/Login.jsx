import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import login from "../assets/login.webp";
import { loginUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/slices/cartSlice";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/");
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      toast.error("Please fill in both email and password");
      return;
    }

    setLocalLoading(true);
    try {
      const result = await dispatch(loginUser({ email, password }));
      if (result?.error) {
        const msg = result?.payload?.message || "Invalid email or password";
        setErrorMessage(msg);
        toast.error(msg);
      }
    } catch (err) {
      console.error(err);
      
      toast.error("Something went wrong. Please try again.");
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left: Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg border border-gray-200 mt-6 shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl poppins-font font-medium">dipdopdrip</h2>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Hey there!</h2>
          <p className="text-center mb-6">
            Enter your username and password to login
          </p>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your password"
              required
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm mb-4 text-center">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={localLoading}
            className={`w-full bg-black text-white p-2 rounded-lg font-semibold transition ${
              localLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-800"
            }`}
          >
            {localLoading ? "Loading..." : "Sign In"}
          </button>

          <p className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link
              to={`/register?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-500"
            >
              Register
            </Link>
          </p>
        </form>
      </div>

      {/* Right: Image (only visible on md and up) */}
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            src={login}
            alt="Login to Account"
            className="h-[750px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
