import Navbar from "../../components/Navbar";
import sleep from "../../assets/sleep.jpg";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import LoginSchema from "../../schema/login.schema";
import { useApi } from "../../hooks/useAPi"; 
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast"; // 1. Added toast

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const { loading, callApi } = useApi();

  const onSubmit = async (data) => {
    try {
      const res = await callApi("POST", "/auth/login", {
        data: {
          email: data.identifier,
          password: data.password,
        },
      });

      // Update context with user details
      login(res.access_token, res.user.role, res.user.id, res.user.fullName);

      toast.success("Login successful!"); // 2. Replaced alert
      navigate(res.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      console.error("Login error:", err.message);
      toast.error(err.response?.data?.message || "Login failed"); // 3. Replaced alert
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      {/* Main Wrapper - Using flex-1 and items-center to keep it centered like the signup */}
      <div className="flex-1 flex justify-center items-center px-4 py-10 w-full">
        
        {/* Card - matches the Signup page maxWidth and rounded look */}
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden border border-gray-100">

          {/* Left: Login Form */}
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center"
          >
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back</h1>
            <p className="text-gray-500 text-sm mb-8">
              Login to access your dashboard.
            </p>

            <div className="space-y-4">
              {/* Email / Phone */}
              <div>
                <input
                  type="text"
                  placeholder="Email or Phone"
                  {...register("identifier")}
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm w-full focus:ring-1 focus:ring-red-500 outline-none"
                />
                {errors.identifier && (
                  <p className="text-red-500 text-[10px] mt-1">{errors.identifier.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password")}
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm w-full pr-10 focus:ring-1 focus:ring-red-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-[10px] mt-1">{errors.password.message}</p>
              )}

              {/* Remember Me */}
              <div className="flex items-center gap-2 py-1">
                <input 
                  type="checkbox" 
                  {...register("remember")} 
                  className="accent-red-600 w-3 h-3" 
                />
                <p className="text-xs text-gray-600">Remember Me</p>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white w-full py-2.5 rounded-lg text-sm font-semibold mt-2 transition-all active:scale-[0.98]"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-center mt-4">
              <Link
                to="/forgotpass"
                className="text-red-600 text-xs font-medium hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <p className="text-[10px] text-center text-gray-400 mt-8">
              © 2026 VitalDrop. All rights reserved.
            </p>
          </form>

          {/* Right: Illustration - Hidden on mobile, fixed "Cramped" look */}
          <div className="hidden md:block md:w-1/2 bg-[#FFF5F5]">
            <div 
              className="w-full h-full min-h-[450px]" 
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

export default LoginPage;