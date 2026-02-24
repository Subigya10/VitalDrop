import Navbar from "../../components/Navbar";
import sleep from "../../assets/sleep.jpg";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "../../schema/register.schema";
import { useApi } from "../../hooks/useAPi";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

function Signuppage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(RegisterSchema) });
  const { loading, error, callApi } = useApi();

  const onSubmit = async (data) => {
    try {
      const res = await callApi("POST", "/users", {
        data: {
          fullName: data.firstName + " " + data.lastName,
          email: data.email,
          password: data.password,
          phoneNumber: data.phone,
          address: null,
          gender: null,
          bloodGroup: null,
          medicalHistory: null,
          dateOfBirth: null,
          role: "user",
        }
      });

      toast.success("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.log("Full backend response:", err.response);
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex justify-center items-center px-4 py-6 w-full">
        {/* Card - Max width reduced slightly to 4xl to keep it compact like Login */}
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden border border-gray-100">

          {/* Form Side - Increased padding for a premium feel */}
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Create Your Account</h1>
            <p className="text-gray-500 text-sm mb-6">Join VitalDrop to save lives.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              {/* First & Last Name */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="First Name"
                    {...register("firstName")}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:ring-1 focus:ring-red-500 outline-none"
                  />
                  {errors.firstName && <p className="text-red-500 text-[10px] mt-1">{errors.firstName.message}</p>}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Last Name (optional)"
                    {...register("lastName")}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:ring-1 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="w-full">
                <input
                  type="text"
                  placeholder="Email"
                  {...register("email")}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:ring-1 focus:ring-red-500 outline-none"
                />
                {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div className="w-full">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  {...register("phone")}
                  maxLength={10}
                  onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, ""); }}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:ring-1 focus:ring-red-500 outline-none"
                />
                {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone.message}</p>}
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password")}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full pr-10 focus:ring-1 focus:ring-red-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[10px] mt-0.5">{errors.password.message}</p>}

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  {...register("confirmPassword")}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full pr-10 focus:ring-1 focus:ring-red-500 outline-none"
                />
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Terms */}
              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" {...register("terms", { required: "You must agree to terms" })} className="accent-red-600 w-3 h-3" />
                <p className="text-[11px] text-gray-500">I agree to the <span className="text-red-600 cursor-pointer font-medium hover:underline">Terms & Conditions</span></p>
              </div>
              {errors.terms && <p className="text-red-500 text-[10px]">{errors.terms.message}</p>}

              {/* Submit */}
              <button 
                type="submit" 
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white w-full py-2.5 rounded-lg text-sm font-semibold mt-2 transition-all active:scale-[0.98]"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>

              <p className="text-[10px] text-center text-gray-400 mt-4">
                © 2026 VitalDrop. All rights reserved.
              </p>
            </form>
          </div>

          {/* Right Side Illustration - Fixed "Cramped" look using background-cover */}
          <div className="hidden md:block md:w-1/2 bg-[#FFF5F5]">
            <div 
              className="w-full h-full min-h-[500px]" 
              style={{ 
                backgroundImage: `url(${sleep})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default Signuppage;