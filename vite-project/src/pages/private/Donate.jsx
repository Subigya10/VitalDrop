import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DonateSchema } from '../../schema/donate.schema';
import { Heart, CheckCircle } from 'lucide-react';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast';

const Donate = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(DonateSchema),
  });

  // Pre-fill name, blood group, phone from user profile
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("access_token");
    axios.get(`http://localhost:5000/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      if (res.data.fullName)    setValue("donorName", res.data.fullName);
      if (res.data.bloodGroup)  setValue("bloodGroup", res.data.bloodGroup);
      if (res.data.phoneNumber) setValue("phone", res.data.phoneNumber);
    }).catch(() => {});
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      await axios.post('http://localhost:5000/api/donations', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessData(data);
      setSubmitted(true);
      toast.success("Donation scheduled! You're a hero 🩸");
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error(err.response.data.message || "Invalid donation details!");
      } else {
        toast.error("Failed to schedule donation. Try again!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (submitted && successData) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto text-center py-10 md:py-20 px-4">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="text-xl md:text-2xl font-black text-gray-800 mb-2">Thank You! 🩸</h1>
          <p className="text-sm text-gray-400 mb-2">Your donation has been scheduled.</p>
          <p className="text-xs text-gray-300 mb-8">
            📅 {new Date(successData.date).toDateString()} &nbsp;·&nbsp; 🏥 {successData.hospital}
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setSuccessData(null);
              reset({
                donorName: successData.donorName,
                bloodGroup: successData.bloodGroup,
                phone: successData.phone,
                hospital: '',
                date: '',
                message: '',
              });
            }}
            className="w-full md:w-auto bg-red-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-600 transition shadow-md active:scale-95">
            Donate Again
          </button>
        </div>
      </Layout>
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <Layout>
      <div className="max-w-xl mx-auto px-2 md:px-0">

        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
            <Heart size={20} className="text-red-500 fill-red-200" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-800">Donate Blood</h1>
            <p className="text-xs md:text-sm text-gray-400">Schedule your blood donation</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8 space-y-4 md:space-y-5">

            {/* Row 1 - Name + Blood Group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 block tracking-wider">
                  Full Name *
                </label>
                <input
                  {...register("donorName")}
                  placeholder="Your full name"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 transition-all"
                />
                {errors.donorName && (
                  <p className="text-red-500 text-[10px] mt-1">{errors.donorName.message}</p>
                )}
              </div>

              <div>
                <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 block tracking-wider">
                  Blood Group *
                </label>
                <select
                  {...register("bloodGroup")}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 bg-white"
                >
                  <option value="">Select</option>
                  {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                {errors.bloodGroup && (
                  <p className="text-red-500 text-[10px] mt-1">{errors.bloodGroup.message}</p>
                )}
              </div>
            </div>

            {/* Row 2 - Phone + Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 block tracking-wider">
                  Phone *
                </label>
                <input
                  {...register("phone")}
                  placeholder="e.g. 9841234567"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 transition-all"
                />
                {errors.phone && (
                  <p className="text-red-500 text-[10px] mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 block tracking-wider">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  {...register("date")}
                  min={todayStr}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 transition-all"
                />
                {errors.date && (
                  <p className="text-red-500 text-[10px] mt-1">{errors.date.message}</p>
                )}
              </div>
            </div>

            {/* Hospital */}
            <div>
              <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 block tracking-wider">
                Hospital *
              </label>
              <input
                {...register("hospital")}
                placeholder="e.g. Patan Hospital, Kathmandu"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 transition-all"
              />
              {errors.hospital && (
                <p className="text-red-500 text-[10px] mt-1">{errors.hospital.message}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 block tracking-wider">
                Message (optional)
              </label>
              <textarea
                {...register("message")}
                rows={3}
                placeholder="Any additional info for the hospital..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 resize-none transition-all"
              />
              {errors.message && (
                <p className="text-red-500 text-[10px] mt-1">{errors.message.message}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white py-3 md:py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-md active:scale-95"
            >
              <Heart size={18} />
              {loading ? "Scheduling..." : "Schedule Donation"}
            </button>

          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Donate;