import Navbar from "../components/Navbar";
import sleep from "../assets/sleep.jpg";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signuppage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      // Optional: check if passwords match
      if (data.password !== data.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      const res = await axios.post("http://localhost:5000/api/users", {
        fullName: data.firstName + " " + data.lastName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phone,
        address: null, // optional, can add field later
        gender: null,  // optional
        bloodGroup: null, // optional
        medicalHistory: null, // optional
        dateOfBirth: null, // optional
      });

      alert("Signup successful! Please login.");
      console.log(res.data);

      // Redirect to login page
      navigate("/login");
    } catch (err) {
  console.log("Full backend response:", err.response); // see exact error
  alert(err.response?.data?.message || "Signup failed");
}

  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20 pb-20 flex justify-center items-center">
        <div className="max-w-6xl w-full bg-white rounded-xl shadow-lg flex overflow-hidden">

          {/* Left: Signup Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="w-1/2 p-10">
            <h1 className="text-2xl font-bold mb-1">Create Your Account</h1>
            <p className="text-gray-500 mb-6">
              Join VitalDrop to save lives.
            </p>

            {/* First & Last Name */}
            <div className="flex gap-3">
              <div className="w-1/2">
                <input
                  type="text"
                  placeholder="First Name"
                  {...register("firstName", { required: "First name is required" })}
                  className="border rounded px-3 py-2 w-full"
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
              </div>

              <div className="w-1/2">
                <input
                  type="text"
                  placeholder="Last Name"
                  {...register("lastName", { required: "Last name is required" })}
                  className="border rounded px-3 py-2 w-full"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              className="border rounded px-3 py-2 w-full mt-4"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}

            {/* Phone */}
            <input
              type="tel"
              placeholder="Phone Number"
              {...register("phone", { required: "Phone number is required" })}
              className="border rounded px-3 py-2 w-full mt-4"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })}
              className="border rounded px-3 py-2 w-full mt-4"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}

            {/* Confirm Password */}
            <input
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword", { required: "Please confirm your password" })}
              className="border rounded px-3 py-2 w-full mt-4"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}

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

          {/* Right: Illustration */}
          <div className="w-1/2 bg-red-50 flex items-center justify-center">
            <img src={sleep} alt="Doctor Illustration" className="max-h-[420px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signuppage;
