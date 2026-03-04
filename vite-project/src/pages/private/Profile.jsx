import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Save, Droplets, Phone, MapPin, Calendar, ClipboardList, Mail, Camera, CheckCircle, AlertTriangle, Heart, Clock, Download } from 'lucide-react';
import Layout from '../../components/Layout.jsx';
import toast from 'react-hot-toast';
import { ProfileSchema } from '../../schema/Profile.schema.js';

const API = 'http://localhost:5000/api';
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('access_token')}` });
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const isEligible = (lastDonationDate) => {
  if (!lastDonationDate) return true;
  const diff = (new Date() - new Date(lastDonationDate)) / (1000 * 60 * 60 * 24);
  return diff >= 90;
};

const daysUntilEligible = (lastDonationDate) => {
  if (!lastDonationDate) return 0;
  const diff = (new Date() - new Date(lastDonationDate)) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.ceil(90 - diff));
};

/* ── Donor Card Generator using HTML Canvas ── */
const downloadDonorCard = ({ fullName, bloodGroup, phoneNumber, address, eligible, completedCount }) => {
  const canvas = document.createElement('canvas');
  canvas.width  = 800;
  canvas.height = 450;
  const ctx = canvas.getContext('2d');

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, 800, 450);
  bgGrad.addColorStop(0, '#1a0a0a');
  bgGrad.addColorStop(1, '#2d0f0f');
  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.roundRect(0, 0, 800, 450, 24);
  ctx.fill();

  // Red accent bar left
  const barGrad = ctx.createLinearGradient(0, 0, 0, 450);
  barGrad.addColorStop(0, '#ef4444');
  barGrad.addColorStop(1, '#991b1b');
  ctx.fillStyle = barGrad;
  ctx.beginPath();
  ctx.roundRect(0, 0, 8, 450, [24, 0, 0, 24]);
  ctx.fill();

  // Decorative circles top right
  ctx.beginPath();
  ctx.arc(750, -30, 180, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(239,68,68,0.06)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(750, -30, 110, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(239,68,68,0.09)';
  ctx.fill();

  // Header label
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('BLOOD DONOR CARD', 36, 44);

  // Blood group box
  ctx.fillStyle = 'rgba(239,68,68,0.12)';
  ctx.beginPath();
  ctx.roundRect(36, 60, 130, 130, 20);
  ctx.fill();
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 56px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(bloodGroup || '—', 101, 145);
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '10px sans-serif';
  ctx.fillText('BLOOD GROUP', 44, 206);

  // Name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText(fullName || 'Unknown', 36, 258);

  // Divider
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(36, 274);
  ctx.lineTo(520, 274);
  ctx.stroke();

  // Info rows
  const infoItems = [
    { label: 'PHONE',     value: phoneNumber || 'Not provided' },
    { label: 'LOCATION',  value: address     || 'Not provided' },
    { label: 'DONATIONS', value: `${completedCount} completed` },
  ];
  infoItems.forEach((item, i) => {
    const y = 306 + i * 36;
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText(item.label, 36, y);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = '14px sans-serif';
    ctx.fillText(item.value, 120, y);
  });

  // Eligibility badge
  const bx = 575, by = 155;
  ctx.fillStyle = eligible ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)';
  ctx.beginPath();
  ctx.roundRect(bx, by, 190, 82, 16);
  ctx.fill();
  ctx.strokeStyle = eligible ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(bx, by, 190, 82, 16);
  ctx.stroke();
  ctx.fillStyle = eligible ? '#10b981' : '#f59e0b';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(eligible ? '✓  READY TO DONATE' : '⏳  NOT ELIGIBLE YET', bx + 95, by + 34);
  ctx.font = '11px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillText(eligible ? 'Available now' : 'Check back later', bx + 95, by + 56);
  ctx.textAlign = 'left';

  // Bottom bar
  ctx.fillStyle = 'rgba(239,68,68,0.08)';
  ctx.beginPath();
  ctx.roundRect(0, 400, 800, 50, [0, 0, 24, 24]);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`VitalDrop · Generated ${new Date().toDateString()}`, 400, 431);
  ctx.textAlign = 'left';

  // Trigger download
  const link = document.createElement('a');
  link.download = `donor-card-${(fullName || 'card').replace(/\s+/g, '-').toLowerCase()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

const Profile = () => {
  const [fetching, setFetching]           = useState(true);
  const [loading, setLoading]             = useState(false);
  const [originalEmail, setOriginalEmail] = useState('');
  const [donations, setDonations]         = useState([]);
  const [avatarSrc, setAvatarSrc]         = useState(null);
  const fileRef = useRef();

  const { register, handleSubmit, control, reset, watch, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: { fullName: '', email: '', phoneNumber: '', address: '', gender: '', bloodGroup: '', dateOfBirth: '', medicalHistory: '' },
  });

  const watchedValues = watch();

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    Promise.all([
      axios.get(`${API}/users/${userId}`, { headers: authHeaders() }),
      axios.get(`${API}/donations/my`,    { headers: authHeaders() }),
    ]).then(([userRes, donRes]) => {
      const d = userRes.data;
      reset({
        fullName: d.fullName || '', email: d.email || '',
        phoneNumber: d.phoneNumber || '', address: d.address || '',
        gender: d.gender || '', bloodGroup: d.bloodGroup || '',
        dateOfBirth: d.dateOfBirth ? d.dateOfBirth.split('T')[0] : '',
        medicalHistory: d.medicalHistory || '',
      });
      setOriginalEmail(d.email || '');
      setDonations(donRes.data || []);
      const saved = localStorage.getItem('avatar_' + userId);
      if (saved) setAvatarSrc(saved);
    }).catch(() => toast.error('Failed to load profile'))
      .finally(() => setFetching(false));
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('user_id');
      await axios.patch(`${API}/users/${userId}`, data, { headers: authHeaders() });
      localStorage.setItem('username', data.fullName);
      reset(data);
      toast.success('Profile updated! ✅');
    } catch { toast.error('Failed to update profile'); }
    finally { setLoading(false); }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target.result;
      setAvatarSrc(src);
      localStorage.setItem('avatar_' + localStorage.getItem('user_id'), src);
      toast.success('Profile picture updated! 📸');
    };
    reader.readAsDataURL(file);
  };

  const completedDonations = donations.filter(d => d.status === 'completed' || d.status === 'approved');
  const lastDonation = completedDonations.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  const eligible = isEligible(lastDonation?.date);
  const daysLeft = daysUntilEligible(lastDonation?.date);
  const age = watchedValues.dateOfBirth
    ? Math.floor((new Date() - new Date(watchedValues.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))
    : null;
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(watchedValues.fullName || 'U')}&background=f87171&color=fff&size=80&bold=true`;

  const handleDownloadCard = () => {
    if (!watchedValues.bloodGroup) {
      toast.error('Please set your blood group first!');
      return;
    }
    downloadDonorCard({
      fullName:       watchedValues.fullName,
      bloodGroup:     watchedValues.bloodGroup,
      phoneNumber:    watchedValues.phoneNumber,
      address:        watchedValues.address,
      eligible,
      completedCount: completedDonations.length,
    });
    toast.success('Donor card downloaded! 🩸');
  };

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

        {/* Avatar Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative shrink-0 group cursor-pointer" onClick={() => fileRef.current.click()}>
            <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-red-100 shadow-md">
              <img src={avatarSrc || defaultAvatar} alt={watchedValues.fullName} className="w-full h-full object-cover" />
            </div>
            {watchedValues.bloodGroup && (
              <div className="absolute -bottom-2 -right-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-md">
                {watchedValues.bloodGroup}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={18} color="white" />
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-black text-gray-800">{watchedValues.fullName || 'Your Name'}</h2>
            <p className="text-sm text-gray-400 mt-0.5">{originalEmail}</p>
            <p className="text-[10px] text-gray-300 mt-0.5">Click avatar to change photo</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              {watchedValues.bloodGroup && <Chip icon={<Droplets size={11} />} text={`Blood: ${watchedValues.bloodGroup}`} color="red" />}
              {watchedValues.gender && <Chip icon={<User size={11} />} text={watchedValues.gender} color="blue" />}
              {age && age > 0 && <Chip icon={<Calendar size={11} />} text={`${age} yrs`} color="purple" />}
              {watchedValues.address && <Chip icon={<MapPin size={11} />} text={watchedValues.address} color="green" />}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <Heart size={18} className="text-red-400 mx-auto mb-1" />
            <p className="text-2xl font-black text-gray-800">{donations.length}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Donations</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <CheckCircle size={18} className="text-green-400 mx-auto mb-1" />
            <p className="text-2xl font-black text-gray-800">{completedDonations.length}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Completed</p>
          </div>
          <div className={`rounded-2xl border shadow-sm p-4 text-center ${eligible ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'}`}>
            {eligible
              ? <CheckCircle size={18} className="text-green-500 mx-auto mb-1" />
              : <AlertTriangle size={18} className="text-orange-400 mx-auto mb-1" />
            }
            <p className={`text-xs font-black ${eligible ? 'text-green-600' : 'text-orange-500'}`}>
              {eligible ? 'Eligible' : `${daysLeft}d`}
            </p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
              {eligible ? 'Can Donate' : 'Days Left'}
            </p>
          </div>
        </div>

        {/* Last donation */}
        {lastDonation && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex items-center gap-3">
            <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
              <Clock size={15} className="text-red-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-600">Last Donation</p>
              <p className="text-sm text-gray-400">{new Date(lastDonation.date).toDateString()} · {lastDonation.hospital}</p>
            </div>
          </div>
        )}

        {/* 🩸 Donor Card Download Banner */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-5 mb-5 flex items-center justify-between shadow-lg shadow-red-200">
          <div>
            <p className="text-white font-black text-sm">🩸 Your Donor Card</p>
            <p className="text-red-100 text-xs mt-0.5">Download your official blood donor ID card as PNG</p>
          </div>
          <button onClick={handleDownloadCard}
            className="bg-white text-red-500 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-red-50 transition active:scale-95 shadow-sm shrink-0 ml-4">
            <Download size={14} />
            Download
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <User size={16} className="text-red-400" />
            <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider">Personal Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" icon={<User size={14} />} error={errors.fullName}>
              <input {...register('fullName')} placeholder="John Doe" className={`input ${errors.fullName ? 'input-error' : ''}`} />
            </Field>
            <Field label="Email" icon={<Mail size={14} />}>
              <input {...register('email')} disabled className="input input-disabled" />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Phone Number" icon={<Phone size={14} />} error={errors.phoneNumber}>
              <input {...register('phoneNumber')} placeholder="98XXXXXXXX" className={`input ${errors.phoneNumber ? 'input-error' : ''}`} />
            </Field>
            <Field label="Date of Birth" icon={<Calendar size={14} />} error={errors.dateOfBirth}>
              <input type="date" {...register('dateOfBirth')} className={`input ${errors.dateOfBirth ? 'input-error' : ''}`} />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Gender" icon={<User size={14} />} error={errors.gender}>
              <select {...register('gender')} className={`input ${errors.gender ? 'input-error' : ''}`}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </Field>
            <Field label="Address" icon={<MapPin size={14} />} error={errors.address}>
              <input {...register('address')} placeholder="Kathmandu, Nepal" className={`input ${errors.address ? 'input-error' : ''}`} />
            </Field>
          </div>

          <Field label="Blood Group" icon={<Droplets size={14} />} error={errors.bloodGroup}>
            <Controller name="bloodGroup" control={control} render={({ field }) => (
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_GROUPS.map(bg => (
                  <button key={bg} type="button" onClick={() => field.onChange(bg)}
                    className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${field.value === bg ? 'bg-red-500 border-red-500 text-white shadow-sm shadow-red-200' : 'border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50'}`}>
                    {bg}
                  </button>
                ))}
              </div>
            )} />
          </Field>

          <Field label="Medical History" icon={<ClipboardList size={14} />} error={errors.medicalHistory}>
            <textarea {...register('medicalHistory')} rows={3}
              placeholder="Any relevant medical history, allergies, conditions..."
              className={`input resize-none ${errors.medicalHistory ? 'input-error' : ''}`} />
          </Field>

          <button onClick={handleSubmit(onSubmit)} disabled={loading || !isDirty}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-md active:scale-[0.98]">
            <Save size={17} />
            {loading ? 'Saving...' : isDirty ? 'Save Changes' : 'No Changes'}
          </button>
        </div>
      </div>

      <style>{`
        .input { width: 100%; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 0.625rem 1rem; font-size: 0.875rem; outline: none; background: white; color: #111827; transition: border-color 0.15s, box-shadow 0.15s; box-sizing: border-box; }
        .input:focus { border-color: #f87171; box-shadow: 0 0 0 3px rgba(248,113,113,0.15); }
        .input-disabled { background: #f9fafb; color: #9ca3af; cursor: not-allowed; }
        .input-error { border-color: #fca5a5; background: #fef2f2; }
      `}</style>
    </Layout>
  );
};

const Field = ({ label, icon, error, children }) => (
  <div>
    <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
      <span className="text-gray-300">{icon}</span>{label}
    </label>
    {children}
    {error && <p className="text-red-500 text-[11px] mt-1">{error.message}</p>}
  </div>
);

const Chip = ({ icon, text, color }) => {
  const colors = { red: 'bg-red-50 text-red-600 border-red-100', blue: 'bg-blue-50 text-blue-600 border-blue-100', purple: 'bg-purple-50 text-purple-600 border-purple-100', green: 'bg-green-50 text-green-600 border-green-100' };
  return (
    <span className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${colors[color]}`}>
      {icon}{text}
    </span>
  );
};

export default Profile;