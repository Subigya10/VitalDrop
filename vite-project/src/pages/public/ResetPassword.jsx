import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";


import { ResetPasswordSchema } from "../../schema/resetpassword.schema";
import { useApi } from "../../hooks/useAPi";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Extract token from URL
  
  const { loading, error, callApi } = useApi();
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const onSubmit = async (data) => {
    setMessage("");

    // Check if token exists
    if (!token) {
      setMessage("Invalid reset link. Please request a new one.");
      return;
    }

    try {
      // Call backend API to reset password
      const res = await callApi("POST", `/auth/resetpass/${token}`, {
        data: {
          password: data.password,
          confirmPassword: data.confirmPassword,
        },
      });

      setMessage(res.message || "Password reset successfully!");
      reset();

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setMessage(err.message || "Failed to reset password. Token may be expired.");
    }
  };

  const inputWrapper =
    "flex items-center border rounded-md bg-gray-100 px-4 py-3 border-gray-300 focus-within:border-blue-500";
  const inputStyle = "flex-1 bg-transparent outline-none text-base";

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center p-4"
    
    >
      <div className="bg-white p-10 rounded-2xl shadow-lg w-[450px]">
        <h2 className="text-3xl mb-2 text-center font-bold">Reset Password</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your new password below
        </p>

        {/* Error or Success Message */}
        {message && (
          <p
            className={`text-sm mb-4 text-center p-3 rounded ${
              error || message.includes("Failed") || message.includes("Invalid")
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Check if token exists */}
        {!token ? (
          <div className="text-center">
            <p className="text-red-600 mb-4">
              Invalid or missing reset token. Please request a new password reset link.
            </p>
            <button
              onClick={() => navigate("/forgotpass")}
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              Request New Link
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* New Password */}
            <div>
              <div className={inputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  {...register("password")}
                  className={inputStyle}
                  maxLength={50}
                />
                  <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <div className={inputWrapper}>
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm New Password"
                  {...register("confirmPassword")}
                  className={inputStyle}
                  maxLength={50}
                />
                  <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-3 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* Back to Login Link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 text-sm hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;