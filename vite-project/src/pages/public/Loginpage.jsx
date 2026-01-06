import Navbar from "../../components/Navbar";
import sleep from "../../assets/sleep.jpg";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import LoginSchema from "../../schema/login.schema";
import { useApi } from "../../hooks/useAPi"; 

function LoginPage() {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const { loading, error, callApi } = useApi();

  const onSubmit = async (data) => {
    try {
      const res = await callApi("POST", "/auth/login", {
        data:{
        email: data.identifier,
        password: data.password,
        },
      });

      console.log("Login response:", res);
console.log("Role saved in localStorage:", res.user?.role);


      // Save token in localStorage
      localStorage.setItem("access_token", res.access_token); 
      localStorage.setItem("role", res.user.role);

      alert("Login successful!");
      console.log(res);

      // Redirect to dashboard (or any page)
      navigate("/dashboard");
    } catch (err) {
      console.log("Login error:", err.message);
      alert(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-36 pb-20 flex justify-center items-center">
        <div className="max-w-6xl w-full bg-white rounded-xl shadow-lg flex overflow-hidden">

          {/* Left: Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="w-1/2 p-10">
            <h1 className="text-2xl font-bold mb-1">Welcome Back</h1>
            <p className="text-gray-500 mb-6">
              Login to access your dashboard.
            </p>

            {/* Email / Phone */}
            <input
              type="text"
              placeholder="Email or Phone"
              {...register("identifier")}
              className="border rounded px-3 py-2 w-full"
            />
            {errors.identifier && (
              <p className="text-red-500 text-sm mt-1">{errors.identifier.message}</p>
            )}

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="border rounded px-3 py-2 w-full mt-4"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}

            {/* Remember Me */}
            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" {...register("remember")} />
              <p className="text-sm text-gray-600">Remember Me</p>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white w-full py-2 rounded mt-5"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Forgot Password */}
            <p className="text-sm text-center text-red-600 mt-4 cursor-pointer">
              Forgot Password?
            </p>

            <p className="text-xs text-center text-gray-400 mt-6">
              © 2024 VitalDrop. All rights reserved.
            </p>
          </form>

          {/* Right: Illustration */}
          <div className="w-1/2 bg-red-50 flex items-center justify-center">
            <img src={sleep} alt="Login Illustration" className="max-h-[420px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
