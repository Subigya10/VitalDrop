import Navbar from "../../components/Navbar";
import sleep from "../../assets/sleep.jpg";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "../../schema/register.schema";
import { useApi } from "../../hooks/useAPi";
import { Eye, EyeOff, Upload, User } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const MEDICAL_CONDITIONS = [
  "Diabetes",
  "Hypertension",
  "Heart Disease",
  "Asthma",
  "HIV/AIDS",
  "Hepatitis B",
  "Hepatitis C",
  "Recent Surgery",
  "Currently on Medication",
  "None of the above",
];

function Signuppage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const { loading, callApi } = useApi();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { medicalHistory: [] },
  });

  const selectedConditions = watch("medicalHistory") || [];

  const toggleCondition = (condition) => {
    if (condition === "None of the above") {
      setValue("medicalHistory", ["None of the above"]);
      return;
    }
    const current = selectedConditions.filter(c => c !== "None of the above");
    if (current.includes(condition)) {
      setValue("medicalHistory", current.filter(c => c !== condition));
    } else {
      setValue("medicalHistory", [...current, condition]);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      setValue("profilePhoto", file);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("fullName", data.firstName + (data.lastName ? " " + data.lastName : ""));
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("phoneNumber", data.phone);
      formData.append("gender", data.gender);
      formData.append("dateOfBirth", data.dateOfBirth);
      formData.append("address", data.address);
      formData.append("bloodGroup", data.bloodGroup);

      const checked = (data.medicalHistory || []).join(", ");
      const notes = data.medicalNotes || "";
      const combined = [checked, notes].filter(Boolean).join(" | ");
      formData.append("medicalHistory", combined);

      formData.append("role", "user");
      if (data.profilePhoto) {
        formData.append("profilePhoto", data.profilePhoto);
      }

      await callApi("POST", "/users", { data: formData });
      toast.success("Account created! Please login. 🎉");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed. Try again!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex justify-center items-start px-4 py-8 w-full">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden border border-gray-100">

          {/* ── FORM SIDE ── */}
          <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto">

            <div className="mb-6">
              <h1 className="text-2xl font-black text-gray-800 mb-1">Create Your Account</h1>
              <p className="text-gray-400 text-sm">Fill in all details to join VitalDrop.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* SECTION 1 — PROFILE PHOTO */}
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">Profile Photo</p>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-dashed border-red-200 flex items-center justify-center overflow-hidden shrink-0">
                    {photoPreview
                      ? <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
                      : <User size={24} className="text-red-300" />
                    }
                  </div>
                  <label className="flex items-center gap-2 bg-gray-50 border border-gray-200 hover:border-red-300 px-4 py-2.5 rounded-xl cursor-pointer transition text-sm font-bold text-gray-500 hover:text-red-500">
                    <Upload size={16} />
                    {photoPreview ? "Change Photo" : "Upload Photo"}
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  </label>
                  {photoPreview && (
                    <button type="button" onClick={() => { setPhotoPreview(null); setValue("profilePhoto", null); }}
                      className="text-xs text-red-400 hover:text-red-600 font-bold">Remove</button>
                  )}
                </div>
              </div>

              {/* SECTION 2 — ACCOUNT INFO */}
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">Account Information</p>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input type="text" placeholder="First Name *" {...register("firstName")}
                        className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm w-full focus:ring-2 focus:ring-red-400/20 focus:border-red-400 outline-none transition-all" />
                      {errors.firstName && <p className="text-red-500 text-[10px] mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <input type="text" placeholder="Last Name (optional)" {...register("lastName")}
                        className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm w-full focus:ring-2 focus:ring-red-400/20 focus:border-red-400 outline-none transition-all" />
                    </div>
                  </div>
                  <div>
                    <input type="text" placeholder="Email Address *" {...register("email")}
                      className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm w-full focus:ring-2 focus:ring-red-400/20 focus:border-red-400 outline-none transition-all" />
                    {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                 
  <input
  type="tel"
  placeholder="Phone Number *"
  {...register("phone", { shouldUnregister: false })}
  maxLength={10}
  onKeyDown={(e) => {
    if (!/[0-9]/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key)) {
      e.preventDefault();
    }
  }}
  onChange={(e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setValue("phone", val, { shouldValidate: true, shouldDirty: true });
  }}
  onBlur={() => setValue("phone", watch("phone") || "", { shouldValidate: true })}
  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm w-full focus:ring-2 focus:ring-red-400/20 focus:border-red-400 outline-none transition-all"
/>
{errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone.message}</p>}
</div>
                  <div>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} placeholder="Password *" {...register("password")}
                        className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm w-full pr-10 focus:ring-2 focus:ring-red-400/20 focus:border-red-400 outline-none transition-all" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-[10px] mt-1">{errors.password.message}</p>}
                  </div>
                  <div>
                    <div className="relative">
                      <input type={showConfirm ? "text" : "password"} placeholder="Confirm Password *" {...register("confirmPassword")}
                        className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm w-full pr-10 focus:ring-2 focus:ring-red-400/20 focus:border-red-400 outline-none transition-all" />
                      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1">{errors.confirmPassword.message}</p>}
                  </div>
                </div>
              </div>

              {/* SECTION 3 — PERSONAL INFO */}
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">Personal Information</p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-2 block">Gender *</label>
                    <div className="flex gap-3 flex-wrap">
                      {["Male", "Female", "Other"].map((g) => (
                        <label key={g} className="flex items-center gap-2 cursor-pointer group">
                          <input type="radio" value={g} {...register("gender")} className="accent-red-500 w-4 h-4" />
                          <span className="text-sm text-gray-600 group-hover:text-red-500 transition font-medium">{g}</span>
                        </label>
                      ))}
                    </div>
                    {errors.gender && <p className="text-red-500 text-[10px] mt-1">{errors.gender.message}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Date of Birth *</label>
                  <input 
  type="date" 
  {...register("dateOfBirth")} 
  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm w-full focus:ring-2 focus:ring-red-400/20 focus:border-red-400 outline-none transition-all" 
/>
                    {errors.dateOfBirth && <p className="text-red-500 text-[10px] mt-1">{errors.dateOfBirth.message}</p>}
                  </div>
                  <div>
                    <input type="text" placeholder="Address * (e.g. Kathmandu, Bagmati)" {...register("address")}
                      className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm w-full focus:ring-2 focus:ring-red-400/20 focus:border-red-400 outline-none transition-all" />
                    {errors.address && <p className="text-red-500 text-[10px] mt-1">{errors.address.message}</p>}
                  </div>
                </div>
              </div>

              {/* SECTION 4 — MEDICAL INFO */}
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">Medical Information</p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Blood Group *</label>
                    <select {...register("bloodGroup")}
                      className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm w-full focus:ring-2 focus:ring-red-400/20 focus:border-red-400 outline-none bg-white transition-all">
                      <option value="">Select Blood Group</option>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                    {errors.bloodGroup && <p className="text-red-500 text-[10px] mt-1">{errors.bloodGroup.message}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-2 block">
                      Medical History (select all that apply)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {MEDICAL_CONDITIONS.map((condition) => (
                        <label key={condition} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedConditions.includes(condition)}
                            onChange={() => toggleCondition(condition)}
                            className="accent-red-500 w-4 h-4 shrink-0"
                          />
                          <span className={`text-xs font-medium transition ${
                            selectedConditions.includes(condition) ? "text-red-500" : "text-gray-500 group-hover:text-gray-700"
                          }`}>
                            {condition}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">
                      Additional Notes <span className="font-normal text-gray-400">(optional)</span>
                    </label>
                    <textarea
                      {...register("medicalNotes")}
                      placeholder="Describe any other conditions, allergies, medications..."
                      rows={3}
                      className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm w-full focus:ring-2 focus:ring-red-400/20 focus:border-red-400 outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* TERMS + SUBMIT */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" {...register("terms")} className="accent-red-600 w-4 h-4 cursor-pointer" />
                    <p className="text-[11px] text-gray-500">
                      I agree to the{" "}
                      <span className="text-red-500 cursor-pointer font-bold hover:underline">Terms & Conditions</span>{" "}
                      and confirm the above information is accurate.
                    </p>
                  </div>
                  {errors.terms && <p className="text-red-500 text-[10px] mt-1">{errors.terms.message}</p>}
                </div>
                <button type="submit" disabled={loading}
                  className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.98] shadow-md shadow-red-100">
                  {loading ? "Creating Account..." : "Create Account 🩸"}
                </button>
                <p className="text-xs text-center text-gray-400">
                  Already have an account?{" "}
                  <span onClick={() => navigate('/login')} className="text-red-500 font-bold cursor-pointer hover:underline">Login</span>
                </p>
              </div>
            </form>
          </div>

          {/* ── IMAGE SIDE ── */}
          <div className="hidden md:block md:w-1/2 sticky top-0 h-screen">
            <img
              src={sleep}
              alt="signup visual"
              className="w-full h-full object-cover"
              style={{ objectPosition: "center top" }}
            />
            <div className="absolute inset-0 bg-red-900/10" />
          </div>

        </div>
      </div>
    </div>
  );
}

export default Signuppage;