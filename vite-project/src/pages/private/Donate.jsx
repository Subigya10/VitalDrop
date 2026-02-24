import React, { useState } from 'react';
import { Heart, CheckCircle } from 'lucide-react';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast'; // Added toast

const Donate = () => {
  const [form, setForm] = useState({
    donorName: '',
    bloodGroup: '',
    phone: '',
    hospital: '',
    date: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.donorName || !form.bloodGroup || !form.phone || !form.hospital || !form.date) {
      toast.error("Please fill in all required fields!"); // Replaced alert
      return;
    }
    setSubmitted(true);
    toast.success("Donation scheduled successfully!"); // Added success toast
  };

  if (submitted) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto text-center py-10 md:py-20 px-4">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="text-xl md:text-2xl font-black text-gray-800 mb-2">Thank You! 🩸</h1>
          <p className="text-sm md:text-gray-400 mb-8">Your donation has been scheduled. You're a hero!</p>
          <button onClick={() => setSubmitted(false)}
            className="w-full md:w-auto bg-red-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-600 transition">
            Donate Again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto px-2 md:px-0">

        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
            <Heart size={20} className="text-red-500 fill-red-200" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-800 uppercase sm:normal-case">Donate Blood</h1>
            <p className="text-xs md:text-sm text-gray-400">Schedule your blood donation</p>
          </div>
        </div>

        {/* Card - Reduced padding on mobile */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8 space-y-4 md:space-y-5">

          {/* Grid becomes 1 column on mobile, 2 columns on small tablets up */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 block">Full Name *</label>
              <input name="donorName" value={form.donorName} onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400" />
            </div>
            <div>
              <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 block">Blood Group *</label>
              <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 bg-white">
                <option value="">Select</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 block">Phone *</label>
              <input name="phone" value={form.phone} onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400" />
            </div>
            <div>
              <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 block">Preferred Date *</label>
              <input type="date" name="date" value={form.date} onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400" />
            </div>
          </div>

          <div>
            <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 block">Hospital *</label>
            <input name="hospital" value={form.hospital} onChange={handleChange}
              placeholder="e.g. Patan Hospital"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400" />
          </div>

          <div>
            <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 block">Message (optional)</label>
            <textarea name="message" value={form.message} onChange={handleChange} rows={3}
              placeholder="Any additional info..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 resize-none" />
          </div>

          <button onClick={handleSubmit}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 md:py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-md active:scale-95">
            <Heart size={18} /> Schedule Donation
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Donate;