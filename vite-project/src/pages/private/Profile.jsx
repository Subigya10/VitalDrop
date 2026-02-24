import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Save } from 'lucide-react';
import Layout from '../../components/Layout.jsx';
import toast from 'react-hot-toast'; // Added toast

const Profile = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    gender: '',
    bloodGroup: '',
    dateOfBirth: '',
    medicalHistory: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("access_token");
    axios.get(`http://localhost:5000/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setForm({
      fullName: res.data.fullName || '',
      email: res.data.email || '',
      phoneNumber: res.data.phoneNumber || '',
      address: res.data.address || '',
      gender: res.data.gender || '',
      bloodGroup: res.data.bloodGroup || '',
      dateOfBirth: res.data.dateOfBirth ? res.data.dateOfBirth.split('T')[0] : '', // Format date for input
      medicalHistory: res.data.medicalHistory || '',
    })).catch(() => toast.error("Failed to load profile data"));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("user_id");
      const token = localStorage.getItem("access_token");
      await axios.patch(`http://localhost:5000/api/users/${userId}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      toast.success("Profile updated successfully! ✅");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      toast.error("Failed to update profile!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-2 md:px-0">
        
        {/* Header - Responsive alignment */}
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
            <User size={22} className="text-red-500" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-800 uppercase sm:normal-case">My Profile</h1>
            <p className="text-xs md:text-sm text-gray-400">Update your personal information</p>
          </div>
        </div>

        {/* Card - Reduced padding on mobile */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8 space-y-4 md:space-y-5">
          
          {/* Row 1: Stacks on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 block tracking-wider">Full Name</label>
              <input name="fullName" value={form.fullName} onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 transition-all" />
            </div>
            <div>
              <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 block tracking-wider">Email (Private)</label>
              <input name="email" value={form.email} disabled
                className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-400 cursor-not-allowed" />
            </div>
          </div>

          {/* Row 2: Stacks on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 block tracking-wider">Phone Number</label>
              <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 transition-all" />
            </div>
            <div>
              <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 block tracking-wider">Blood Group</label>
              <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 bg-white">
                <option value="">Select</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Stacks on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 block tracking-wider">Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 bg-white">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 block tracking-wider">Date of Birth</label>
              <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400" />
            </div>
          </div>

          <div>
            <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 block tracking-wider">Address</label>
            <input name="address" value={form.address} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400" />
          </div>

          <div>
            <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 block tracking-wider">Medical History</label>
            <textarea name="medicalHistory" value={form.medicalHistory} onChange={handleChange} rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 resize-none" />
          </div>

          {/* Success Banner - Better mobile padding */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-[11px] md:text-sm px-4 py-3 rounded-xl animate-in fade-in slide-in-from-top-1">
              ✅ Profile updated successfully!
            </div>
          )}

          <button onClick={handleSave} disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-md active:scale-[0.98]">
            <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;