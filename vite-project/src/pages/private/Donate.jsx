import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DonateSchema } from '../../schema/donate.schema';
import { Heart, CheckCircle, User, Phone, MapPin, Calendar, MessageSquare } from 'lucide-react';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const Donate = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(DonateSchema),
  });

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

  const todayStr = new Date().toISOString().split('T')[0];

  if (submitted && successData) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto text-center py-20 px-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-black text-gray-800 mb-2">Thank You! 🩸</h1>
          <p className="text-sm text-gray-400 mb-2">Your donation has been scheduled.</p>
          <p className="text-xs text-gray-400 mb-8">
            📅 {new Date(successData.date).toDateString()} &nbsp;·&nbsp; 🏥 {successData.hospital}
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setSuccessData(null);
              reset({ donorName: successData.donorName, bloodGroup: successData.bloodGroup, phone: successData.phone, hospital: '', date: '', message: '' });
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-10 py-3 rounded-xl font-bold transition shadow-sm active:scale-95 inline-flex items-center gap-2"
          >
            <Heart size={16} /> Donate Again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 bg-red-100 rounded-full flex items-center justify-center shrink-0">
            <Heart size={20} className="text-red-500 fill-red-200" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-800">Donate Blood</h1>
            <p className="text-sm text-gray-400">Schedule your blood donation</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">

          {/* Row 1: Name + Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Full Name *</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  {...register("donorName")}
                  placeholder="Your full name"
                  className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 transition-all ${errors.donorName ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                />
              </div>
              {errors.donorName && <p className="text-red-500 text-[11px] mt-1">{errors.donorName.message}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Phone *</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  {...register("phone")}
                  placeholder="98XXXXXXXX"
                  className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 transition-all ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-[11px] mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Blood Group */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Blood Group *</label>
            <Controller name="bloodGroup" control={control} render={({ field }) => (
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_GROUPS.map(bg => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => field.onChange(bg)}
                    className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${
                      field.value === bg
                        ? 'bg-red-500 border-red-500 text-white shadow-sm shadow-red-200'
                        : 'border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            )} />
            {errors.bloodGroup && <p className="text-red-500 text-[11px] mt-1">{errors.bloodGroup.message}</p>}
          </div>

          {/* Row 2: Hospital + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Hospital *</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  {...register("hospital")}
                  placeholder="e.g. Patan Hospital"
                  className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 transition-all ${errors.hospital ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                />
              </div>
              {errors.hospital && <p className="text-red-500 text-[11px] mt-1">{errors.hospital.message}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Date *</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="date"
                  {...register("date")}
                  min={todayStr}
                  className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 transition-all ${errors.date ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                />
              </div>
              {errors.date && <p className="text-red-500 text-[11px] mt-1">{errors.date.message}</p>}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
              Message <span className="normal-case font-normal text-gray-300">(optional)</span>
            </label>
            <div className="relative">
              <MessageSquare size={14} className="absolute left-3 top-3.5 text-gray-300" />
              <textarea
                {...register("message")}
                rows={3}
                placeholder="Any additional info for the hospital..."
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 resize-none transition-all"
              />
            </div>
            {errors.message && <p className="text-red-500 text-[11px] mt-1">{errors.message.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-200 disabled:text-gray-400 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-sm active:scale-95"
          >
            <Heart size={17} />
            {loading ? "Scheduling..." : "Schedule Donation"}
          </button>

        </div>
      </div>
    </Layout>
  );
};

export default Donate;