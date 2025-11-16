import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import logo from "/login_logo.png";

import { adminLogin, forgotPassword } from "../api/auth";
import { sendOTP, verifyOTP, completeLogin } from "../api/twoFactor";
import { verifyGoogleAuthCode } from "../api/googleAuth";

import Toaster from "../components/Toaster";
import TwoFactorVerification from "../components/TwoFactorVerification";
import GoogleAuthVerification from "../components/GoogleAuthVerification";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    if (token && userRole === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const [view, setView] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [forgotEmail, setForgotEmail] = useState("");

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
    loading: false,
  });

  // 2FA States
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showGoogleAuthModal, setShowGoogleAuthModal] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ---------------- LOGIN HANDLER (ADMIN ONLY) ----------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setToast({
      show: true,
      message: "Logging in...",
      type: "info",
      loading: true,
    });

    try {
      const response = await adminLogin(formData);

      if (response && response.success) {
        // Check if 2FA is required
        if (response.requiresTwoFactor) {
          // Store user data for 2FA
          setTwoFactorData({
            userId: response.userId,
            email: response.email
          });
          
          // Check which 2FA method to use
          if (response.twoFactorMethod === 'google_authenticator') {
            // Google Authenticator - no need to send OTP
            setToast({ show: true, message: "Please enter code from Google Authenticator", type: "info", loading: false });
            setShowGoogleAuthModal(true);
          } else if (response.twoFactorMethod === 'email_otp') {
            // Email OTP - send OTP to user's email
            setToast({ show: true, message: "Sending verification code...", type: "info", loading: false });
            await sendOTP(response.userId, response.email);
            setToast({ show: true, message: "Verification code sent to your email", type: "success", loading: false });
            setShow2FAModal(true);
          }
          return;
        }

        // Normal login without 2FA
        const { user, token } = response.data;
        login(user, token);

        setToast({
          show: true,
          message: response.message || "Successfully logged in!",
          type: "success",
          loading: false,
        });

        setTimeout(() => {
          navigate("/admin");
        }, 600);
      } else {
        throw new Error("Invalid server response.");
      }
    } catch (error) {
      setToast({
        show: true,
        message: error.message || "Login failed.",
        type: "error",
        loading: false,
      });
      setFormData({ email: "", password: "" });
    }
  };

  // ---------------- 2FA HANDLERS ----------------
  const handle2FAVerify = async (otp) => {
    try {
      // Verify OTP
      await verifyOTP(twoFactorData.userId, otp);
      
      // Complete login after successful verification
      const response = await completeLogin(twoFactorData.userId);
      
      if (response && response.data) {
        const { user, token } = response.data;
        login(user, token);

        setShow2FAModal(false);
        setToast({ show: true, message: "Successfully logged in!", type: "success", loading: false });
        
        setTimeout(() => {
          navigate("/admin");
        }, 500);
      }
    } catch (error) {
      throw new Error(error.message || "Invalid OTP. Please try again.");
    }
  };

  const handle2FAResend = async () => {
    try {
      await sendOTP(twoFactorData.userId, twoFactorData.email);
      setToast({ show: true, message: "New verification code sent", type: "success", loading: false });
    } catch (error) {
      throw new Error(error.message || "Failed to resend code");
    }
  };

  const handle2FAClose = () => {
    setShow2FAModal(false);
    setTwoFactorData(null);
    setFormData({ email: "", password: "" });
  };

  // ---------------- GOOGLE AUTH HANDLERS ----------------
  const handleGoogleAuthVerify = async (code) => {
    try {
      // Verify Google Auth code
      await verifyGoogleAuthCode(twoFactorData.userId, code);
      
      // Complete login after successful verification
      const response = await completeLogin(twoFactorData.userId);
      
      if (response && response.data) {
        const { user, token } = response.data;
        login(user, token);

        setShowGoogleAuthModal(false);
        setToast({ show: true, message: "Successfully logged in!", type: "success", loading: false });
        
        setTimeout(() => {
          navigate("/admin");
        }, 500);
      }
    } catch (error) {
      throw new Error(error.message || "Invalid code. Please try again.");
    }
  };

  const handleGoogleAuthClose = () => {
    setShowGoogleAuthModal(false);
    setTwoFactorData(null);
    setFormData({ email: "", password: "" });
  };

  // ---------------- FORGOT PASSWORD ----------------
  const handleForgot = async (e) => {
    e.preventDefault();
    setToast({
      show: true,
      message: "Sending reset link...",
      type: "info",
      loading: true,
    });

    try {
      const response = await forgotPassword(forgotEmail);

      if (response.success) {
        setToast({
          show: true,
          message: response.message,
          type: "success",
          loading: false,
        });

        setForgotEmail("");
        setTimeout(() => setView("login"), 2000);
      } else {
        setToast({
          show: true,
          message: response.message || "Failed to send reset link",
          type: "error",
          loading: false,
        });
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to send reset link.";

      setToast({
        show: true,
        message: msg,
        type: "error",
        loading: false,
      });
    }
  };

  // ---------------- UI CONTENT SWITCH ----------------
  const renderContent = () => {
    if (view === "forgot") {
      return (
        <div className="text-center">
          <h2 className="text-xl font-bold text-center mb-2 text-white">
            Reset Password
          </h2>
          <p className="text-gray-300 text-center mb-6">
            Enter your email to receive a reset link
          </p>

          <form onSubmit={handleForgot}>
            <div className="mb-6 text-left">
              <label className="block text-gray-200 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="input"
                placeholder="Enter your Email"
                required
              />
            </div>

            <button
              type="submit"
              className="btn w-full disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={toast.loading}
            >
              {toast.loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <button
            onClick={() => setView("login")}
            className="font-semibold text-[#ac51fc] hover:text-white text-sm mt-6 block mx-auto"
          >
            ← Back to Login
          </button>
        </div>
      );
    }

    // ----------- LOGIN VIEW (ADMIN ONLY) ----------
    return (
      <>
        <h2 className="text-3xl font-extrabold text-center mb-6 text-white">
          Admin Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-200 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input"
              placeholder="Enter your Email"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-gray-200 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="input"
              placeholder="Enter Password"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[2.4rem] text-gray-400 text-lg cursor-pointer"
            >
              {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </span>
          </div>

          <div className="flex items-center justify-end text-sm mt-2">
            <button
              type="button"
              onClick={() => setView("forgot")}
              className="text-gray-300 hover:text-white cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="btn w-full mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={toast.loading}
          >
            {toast.loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center w-full px-4">
        <img src={logo} alt="Logo" className="w-40 mb-10" />
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-lg p-6 sm:p-10 lg:py-10 lg:px-14 lg:mb-9 border border-white/20">
          {renderContent()}
        </div>
      </div>

      {toast.show && (
        <Toaster
          message={toast.message}
          type={toast.type}
          loading={toast.loading}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* 2FA Verification Modal */}
      <TwoFactorVerification
        isOpen={show2FAModal}
        onClose={handle2FAClose}
        onVerify={handle2FAVerify}
        onResend={handle2FAResend}
        userEmail={twoFactorData?.email || ""}
      />

      {/* Google Auth Verification Modal */}
      <GoogleAuthVerification
        isOpen={showGoogleAuthModal}
        onClose={handleGoogleAuthClose}
        onVerify={handleGoogleAuthVerify}
      />
    </div>
  );
};

export default Login;
