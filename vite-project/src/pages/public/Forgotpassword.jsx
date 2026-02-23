import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import forgotImg from "../../assets/sleep.jpg";
import { useApi } from "../../hooks/useAPi";
import { useNavigate } from "react-router-dom";


const ForgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const { loading, error, callApi } = useApi();
  const [message, setMessage] = useState("");

  const navigate = useNavigate();




 const onSubmit = async (data) => {
  setMessage(""); // reset previous messages
  try {
    const res = await callApi("POST", "/auth/forgotpass", {data: { email: data.email }});

    setMessage(res?.data?.message || res?.message || "Check your email for a reset link!");


       setTimeout(() => {
      navigate("/reset-password");   // use your actual reset route
    }, 2000);
  } catch (err) {
    console.error("Forgot password error:", err);
    
    // Safe error handling
    if (err && typeof err === 'object') {
      setMessage(err.message || err.response?.data?.message || "Failed to send reset link");
    } else {
      setMessage("Failed to send reset link");
    }
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-[90%] max-w-[1100px] h-[90vh] bg-white rounded-2xl shadow-lg flex justify-center items-center">
        <div className="w-full flex justify-between px-12">

          {/* Left image */}
          <div className="flex-1 flex justify-start">
            <img src={forgotImg} alt="Password Illustration" className="w-[550px] h-auto" />
          </div>

          {/* Right form */}
          <div className="flex-1 text-left mt-48">
            <h2 className="text-3xl mb-5">Forgot Your Password?</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-4/5">
              <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-100">
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className="flex-1 bg-transparent outline-none text-base"
                />
                <span className="ml-2 text-xl">✉️</span>
              </div>
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-[150px] py-3 rounded-full bg-blue-600 text-white text-base hover:bg-blue-800 transition-colors"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              {message && <p className="mt-2 text-green-600">{message}</p>}
              {error && !message && <p className="mt-2 text-red-600">{error}</p>}
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;