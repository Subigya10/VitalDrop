import Navbar from "../../components/Navbar";
import sleep from "../../assets/sleep.jpg";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "../../schema/register.schema";
import { useApi } from "../../hooks/useAPi";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

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

      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.log("Full backend response:", err.response);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Wrapper */}
      <div className="flex-1 flex justify-center items-center px-4 py-10 w-full">
        {/* Card */}
        <div className="w-full h-full max-w-5xl bg-white rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden">

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center h-full">
            <h1 className="text-2xl font-bold mb-1">Create Your Account</h1>
            <p className="text-gray-500 mb-6">Join VitalDrop to save lives.</p>

            {/* First & Last Name */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="First Name"
                  {...register("firstName")}
                  className="border rounded px-3 py-2 w-full"
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Last Name (optional)"
                  {...register("lastName")}
                  className="border rounded px-3 py-2 w-full"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            {/* Email */}
            <input
              type="text"
              placeholder="Email"
              {...register("email")}
              className="border rounded px-3 py-2 w-full mt-4"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}

            {/* Phone */}
            <input
              type="tel"
              placeholder="Phone Number"
              {...register("phone")}
              maxLength={10}
              onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, ""); }}
              className="border rounded px-3 py-2 w-full mt-4"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}

            {/* Password */}
            <div className="relative mt-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                className="border rounded px-3 py-2 w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}

            {/* Confirm Password */}
            <div className="relative mt-4">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("confirmPassword")}
                className="border rounded px-3 py-2 w-full pr-10"
              />
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Terms */}
            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" {...register("terms", { required: "You must agree to terms" })} />
              <p className="text-sm">I agree to the <span className="text-red-600 cursor-pointer">Terms & Conditions</span></p>
            </div>
            {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>}

            {/* Submit */}
            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white w-full py-2 rounded mt-5">
              Sign Up
            </button>

            <p className="text-xs text-center text-gray-400 mt-6">
              © 2024 VitalDrop. All rights reserved.
            </p>
          </form>

          {/* Illustration (hidden on small screens) */}
          <div className="hidden md:flex md:w-1/2 bg-red-50 items-center justify-center h-full">
            <img src={sleep} alt="Illustration" className="max-h-full object-contain" />
          </div>

        </div>
      </div>
    </div>
  );
}

export default Signuppage;
