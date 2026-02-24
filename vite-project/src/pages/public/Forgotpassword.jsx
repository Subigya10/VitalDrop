import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import forgotImg from "../../assets/sleep.jpg";
import { useApi } from "../../hooks/useAPi";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react"; // Added icons for a better look
import toast from "react-hot-toast";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const { loading, callApi } = useApi();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const forgotPromise = callApi("POST", "/auth/forgotpass", { data: { email: data.email } });

    toast.promise(forgotPromise, {
      loading: 'Sending reset link...',
      success: (res) => {
        setTimeout(() => navigate("/reset-password"), 2000);
        return res?.data?.message || "Check your email for a reset link!";
      },
      error: (err) => err.response?.data?.message || "Failed to send reset link",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      
      {/* Main Card */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden min-h-[500px]">
        
        {/* Illustration Side */}
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

        {/* Form Side */}
        <div className="w-full md:w-1/2 p-6 sm:p-12 flex flex-col justify-center">
          
          {/* Header on one line */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <Mail size={20} className="text-red-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-800 tracking-tight">
                Forgot Your Password?
              </h2>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm ml-1">
              Enter your email address and we'll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-red-500 transition-all">
                <input
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                  className="flex-1 bg-transparent outline-none text-sm text-gray-700"
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-[10px] mt-1 ml-1 font-semibold italic">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-100 active:scale-[0.98] disabled:bg-gray-300 flex justify-center items-center"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <button 
              type="button"
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center gap-2 text-xs font-bold text-gray-400 hover:text-red-600 transition-all"
            >
              <ArrowLeft size={14} /> Back to Login
            </button>
          </form>

          <p className="text-[10px] text-center text-gray-300 mt-10">
            © 2026 VitalDrop. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;