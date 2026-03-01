import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Save, Droplets, Phone, MapPin, Calendar, ClipboardList, Mail } from 'lucide-react';
import Layout from '../../components/Layout.jsx';
import toast from 'react-hot-toast';

const API = 'http://localhost:5000/api';
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('access_token')}` });

const BLOOD_GROUPS = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

const Profile = () => {
  const [form, setForm] = useState({
    fullName: '', email: '', phoneNumber: '', address: '',
    gender: '', bloodGroup: '', dateOfBirth: '', medicalHistory: '',
  });
  const [original, setOriginal] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    axios.get(`${API}/users/${userId}`, { headers: authHeaders() })
      .then(res => {
        const data = {
          fullName:      res.data.fullName || '',
          email:         res.data.email || '',
          phoneNumber:   res.data.phoneNumber || '',
          address:       res.data.address || '',
          gender:        res.data.gender || '',
          bloodGroup:    res.data.bloodGroup || '',
          dateOfBirth:   res.data.dateOfBirth ? res.data.dateOfBirth.split('T')[0] : '',
          medicalHistory: res.data.medicalHistory || '',
        };
        setForm(data);
        setOriginal(data);
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setFetching(false));
  }, []);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const isDirty = JSON.stringify(form) !== JSON.stringify(original);

  const handleSave = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('user_id');
      await axios.patch(`${API}/users/${userId}`, form, { headers: authHeaders() });
      // Sync localStorage so Dashboard name updates instantly
      localStorage.setItem('username', form.fullName);
      setOriginal(form);
      toast.success('Profile updated! ✅');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const age = form.dateOfBirth
    ? Math.floor((new Date() - new Date(form.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  if (fetching) return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-2 md:px-0 pb-10">

        {/* ── Avatar Header ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-red-100 shadow-md">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(form.fullName || 'U')}&background=f87171&color=fff&size=80&bold=true`}
                alt={form.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            {form.bloodGroup && (
              <div className="absolute -bottom-2 -right-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-md">
                {form.bloodGroup}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-black text-gray-800">{form.fullName || 'Your Name'}</h2>
            <p className="text-sm text-gray-400 mt-0.5">{form.email}</p>

            {/* Quick stats row */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-3">
              {form.bloodGroup && (
                <Chip icon={<Droplets size={12} />} text={`Blood: ${form.bloodGroup}`} color="red" />
              )}
              {form.gender && (
                <Chip icon={<User size={12} />} text={form.gender} color="blue" />
              )}
              {age && (
                <Chip icon={<Calendar size={12} />} text={`${age} years old`} color="purple" />
              )}
              {form.address && (
                <Chip icon={<MapPin size={12} />} text={form.address} color="green" />
              )}
            </div>
          </div>
        </div>

        {/* ── Form Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8 space-y-5">

          <div className="flex items-center gap-2 mb-1">
            <User size={16} className="text-red-400" />
            <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider">Personal Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" icon={<User size={14} />}>
              <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="John Doe"
                className="input" />
            </Field>
            <Field label="Email" icon={<Mail size={14} />}>
              <input name="email" value={form.email} disabled
                className="input input-disabled" />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Phone Number" icon={<Phone size={14} />}>
              <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="9800000000"
                className="input" />
            </Field>
            <Field label="Blood Group" icon={<Droplets size={14} />}>
              <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="input">
                <option value="">Select</option>
                {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Gender" icon={<User size={14} />}>
              <select name="gender" value={form.gender} onChange={handleChange} className="input">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </Field>
            <Field label="Date of Birth" icon={<Calendar size={14} />}>
              <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange}
                className="input" />
            </Field>
          </div>

          <Field label="Address" icon={<MapPin size={14} />}>
            <input name="address" value={form.address} onChange={handleChange} placeholder="Kathmandu, Nepal"
              className="input" />
          </Field>

          <Field label="Medical History" icon={<ClipboardList size={14} />}>
            <textarea name="medicalHistory" value={form.medicalHistory} onChange={handleChange} rows={3}
              placeholder="Any relevant medical history, allergies, conditions..."
              className="input resize-none" />
          </Field>

          <button
            onClick={handleSave}
            disabled={loading || !isDirty}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-md active:scale-[0.98]"
          >
            <Save size={17} />
            {loading ? 'Saving...' : isDirty ? 'Save Changes' : 'No Changes'}
          </button>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
          outline: none;
          background: white;
          color: #111827;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .input:focus {
          border-color: #f87171;
          box-shadow: 0 0 0 3px rgba(248,113,113,0.15);
        }
        .input-disabled {
          background: #f9fafb;
          color: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>
    </Layout>
  );
};

const Field = ({ label, icon, children }) => (
  <div>
    <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
      <span className="text-gray-300">{icon}</span>
      {label}
    </label>
    {children}
  </div>
);

const Chip = ({ icon, text, color }) => {
  const colors = {
    red:    'bg-red-50 text-red-600 border-red-100',
    blue:   'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    green:  'bg-green-50 text-green-600 border-green-100',
  };
  return (
    <span className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${colors[color]}`}>
      {icon}{text}
    </span>
  );
};

export default Profile;