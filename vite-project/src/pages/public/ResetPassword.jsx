import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import forgotImg from "../../assets/sleep.jpg"; // Using same asset as forgot pass
import { ResetPasswordSchema } from "../../schema/resetpassword.schema";
import { useApi } from "../../hooks/useAPi";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const { loading, callApi } = useApi();
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
    if (!token) {
      toast.error("Invalid reset link. Please request a new one.");
      return;
    }

    const resetPromise = callApi("POST", `/auth/resetpass/${token}`, {
      data: {
        password: data.password,
        confirmPassword: data.confirmPassword,
      },
    });

    toast.promise(resetPromise, {
      loading: 'Resetting your password...',
      success: (res) => {
        reset();
        setTimeout(() => navigate("/login"), 2000);
        return res.message || "Password reset successfully!";
      },
      error: (err) => err.message || "Failed to reset password. Token may be expired.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      
      {/* Main Card */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden min-h-[500px]">
        
        {/* Left Side: Illustration (Hidden on mobile) */}
        <div className="hidden md:block md:w-1/2 bg-red-50">
          <div 
            className="w-full h-full"
            style={{ 
              backgroundImage: `url(${forgotImg})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center' 
            }}
          />
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-12 flex flex-col justify-center">
          
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <Lock size={20} className="text-red-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-800 tracking-tight">
                Reset Password
              </h2>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm ml-1">
              Please enter and confirm your new secure password.
            </p>
          </div>

          {!token ? (
            <div className="text-center p-6 bg-red-50 rounded-2xl border border-red-100">
              <p className="text-red-600 text-sm font-medium mb-4">
                Invalid or missing reset token.
              </p>
              <button
                onClick={() => navigate("/forgotpass")}
                className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-100"
              >
                Request New Link
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  New Password
                </label>
                <div className="relative flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-red-500 transition-all">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className="flex-1 bg-transparent outline-none text-sm text-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-[10px] mt-1 ml-1 font-semibold italic">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Confirm Password
                </label>
                <div className="relative flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-red-500 transition-all">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    className="flex-1 bg-transparent outline-none text-sm text-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-[10px] mt-1 ml-1 font-semibold italic">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-100 active:scale-[0.98] disabled:bg-gray-400"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <button 
                type="button"
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-gray-400 hover:text-red-600 transition-all"
              >
                <ArrowLeft size={14} /> Back to Login
              </button>
            </form>
          )}

          <p className="text-[10px] text-center text-gray-300 mt-10">
            © 2026 VitalDrop. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;