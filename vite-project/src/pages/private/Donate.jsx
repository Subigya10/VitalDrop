import React, { useState } from 'react';
import { Heart, CheckCircle } from 'lucide-react';
import Layout from '../../components/Layout';

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
      alert("Please fill in all required fields!");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto text-center py-20">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-black text-gray-800 mb-2">Thank You! 🩸</h1>
          <p className="text-gray-400 mb-8">Your donation has been scheduled. You're a hero!</p>
          <button onClick={() => setSubmitted(false)}
            className="bg-red-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-600 transition">
            Donate Again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto">

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Heart size={24} className="text-red-500 fill-red-200" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-800">Donate Blood</h1>
            <p className="text-sm text-gray-400">Schedule your blood donation</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Full Name *</label>
              <input name="donorName" value={form.donorName} onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Blood Group *</label>
              <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400">
                <option value="">Select</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Phone *</label>
              <input name="phone" value={form.phone} onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Preferred Date *</label>
              <input type="date" name="date" value={form.date} onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Hospital *</label>
            <input name="hospital" value={form.hospital} onChange={handleChange}
              placeholder="e.g. Patan Hospital"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400" />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Message (optional)</label>
            <textarea name="message" value={form.message} onChange={handleChange} rows={3}
              placeholder="Any additional info..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 resize-none" />
          </div>

          <button onClick={handleSubmit}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-md">
            <Heart size={18} /> Schedule Donation
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Donate;