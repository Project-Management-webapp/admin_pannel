import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import logo from "/login_logo.png";
import { resetPassword } from "../api/auth";
import Toaster from "../components/Toaster";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
    loading: false,
  });

  const [passwordStrength, setPasswordStrength] = useState({
    level: "",
    color: "",
    width: "0%",
  });

  // Validate token exists
  useEffect(() => {
    if (!token) {
      setToast({
        show: true,
        message: "Invalid reset link",
        type: "error",
        loading: false,
      });
      setTimeout(() => navigate("/"), 2000);
    }
  }, [token, navigate]);

  // Password strength checker
  useEffect(() => {
    const password = formData.newPassword;
    if (password.length === 0) {
      setPasswordStrength({ level: "", color: "", width: "0%" });
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) {
      setPasswordStrength({
        level: "Weak",
        color: "bg-red-500",
        width: "33%",
      });
    } else if (strength === 3) {
      setPasswordStrength({
        level: "Medium",
        color: "bg-yellow-500",
        width: "66%",
      });
    } else {
      setPasswordStrength({
        level: "Strong",
        color: "bg-green-500",
        width: "100%",
      });
    }
  }, [formData.newPassword]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePassword = () => {
    if (formData.newPassword.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (formData.newPassword !== formData.confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const validationError = validatePassword();
    if (validationError) {
      setToast({
        show: true,
        message: validationError,
        type: "error",
        loading: false,
      });
      return;
    }

    setToast({
      show: true,
      message: "Resetting password...",
      type: "info",
      loading: true,
    });

    try {
      const response = await resetPassword(token, formData.newPassword);

      if (response.success) {
        setToast({
          show: true,
          message: response.message || "Password reset successful!",
          type: "success",
          loading: false,
        });

        setFormData({ newPassword: "", confirmPassword: "" });

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        throw new Error(response.message || "Failed to reset password");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to reset password. The link may have expired.";

      setToast({
        show: true,
        message: msg,
        type: "error",
        loading: false,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center w-full px-4">
        <img src={logo} alt="Logo" className="w-40 mb-10" />
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-lg p-6 sm:p-10 lg:py-10 lg:px-14 lg:mb-9 border border-white/20">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-center mb-2 text-white">
              Reset Password
            </h2>
            <p className="text-gray-300 text-center mb-6">
              Enter your new password below
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* New Password */}
              <div className="relative text-left">
                <label className="block text-gray-200 text-sm font-bold mb-2">
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Enter new password"
                  required
                  minLength={8}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[2.4rem] text-gray-400 text-lg cursor-pointer"
                >
                  {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </span>
              </div>

              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-300">
                      Password Strength
                    </span>
                    <span className="text-xs text-gray-300">
                      {passwordStrength.level}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: passwordStrength.width }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Confirm Password */}
              <div className="relative text-left">
                <label className="block text-gray-200 text-sm font-bold mb-2">
                  Confirm Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Confirm new password"
                  required
                  minLength={8}
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[2.4rem] text-gray-400 text-lg cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <AiOutlineEye />
                  ) : (
                    <AiOutlineEyeInvisible />
                  )}
                </span>
              </div>

              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className="text-left">
                  {formData.newPassword === formData.confirmPassword ? (
                    <p className="text-green-400 text-xs">✓ Passwords match</p>
                  ) : (
                    <p className="text-red-400 text-xs">✗ Passwords do not match</p>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="btn w-full mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={toast.loading}
              >
                {toast.loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>

            <button
              onClick={() => navigate("/")}
              className="font-semibold text-[#ac51fc] hover:text-white text-sm mt-6 block mx-auto"
            >
              ← Back to Login
            </button>
          </div>
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
    </div>
  );
};

export default ResetPasswordPage;
