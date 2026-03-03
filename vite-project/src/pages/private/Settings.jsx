import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Settings, Lock, Mail, Bell, Trash2 } from 'lucide-react';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast';

const EmailSchema = z.object({
  email: z.string().min(1, 'Please enter your email').email('Invalid email address'),
});

const PasswordSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("access_token");

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm({
    resolver: zodResolver(EmailSchema),
    defaultValues: { email: localStorage.getItem("email") || "" },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(PasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const onEmailUpdate = async (data) => {
    try {
      setLoadingEmail(true);
      await axios.patch(`http://localhost:5000/api/users/${userId}`,
        { email: data.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Email updated successfully!");
    } catch {
      toast.error("Failed to update email!");
    } finally {
      setLoadingEmail(false);
    }
  };

  const onPasswordUpdate = async (data) => {
    try {
      setLoadingPassword(true);
      await axios.patch(`http://localhost:5000/api/users/${userId}`,
        { password: data.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      resetPassword();
      toast.success("Password updated successfully!");
    } catch {
      toast.error("Failed to update password!");
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure? This cannot be undone!");
    if (!confirmDelete) return;

    const deletePromise = axios.delete(`http://localhost:5000/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    toast.promise(deletePromise, {
      loading: 'Deleting account...',
      success: () => {
        localStorage.clear();
        setTimeout(() => window.location.href = "/login", 1000);
        return "Account deleted. We're sad to see you go.";
      },
      error: 'Failed to delete account.',
    });
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto space-y-4 md:space-y-6 px-2 md:px-0">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
            <Settings size={22} className="text-gray-500" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-800">Settings</h1>
            <p className="text-xs md:text-sm text-gray-400">Manage your account</p>
          </div>
        </div>

        {/* Change Email */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-gray-400" />
            <h2 className="font-bold text-sm md:text-base text-gray-700">Change Email</h2>
          </div>
          <div>
            <input
              {...registerEmail('email')}
              type="email"
              placeholder="your@email.com"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 transition-all ${emailErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
            />
            {emailErrors.email && <p className="text-red-500 text-[11px] mt-1">{emailErrors.email.message}</p>}
          </div>
          <button
            onClick={handleEmailSubmit(onEmailUpdate)}
            disabled={loadingEmail}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white py-2.5 rounded-xl font-bold transition shadow-sm active:scale-[0.98]"
          >
            {loadingEmail ? "Saving..." : "Update Email"}
          </button>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-gray-400" />
            <h2 className="font-bold text-sm md:text-base text-gray-700">Change Password</h2>
          </div>
          <div className="space-y-3">
            <div>
              <input
                {...registerPassword('newPassword')}
                type="password"
                placeholder="New Password"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 transition-all ${passwordErrors.newPassword ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              />
              {passwordErrors.newPassword && <p className="text-red-500 text-[11px] mt-1">{passwordErrors.newPassword.message}</p>}
            </div>
            <div>
              <input
                {...registerPassword('confirmPassword')}
                type="password"
                placeholder="Confirm New Password"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 transition-all ${passwordErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              />
              {passwordErrors.confirmPassword && <p className="text-red-500 text-[11px] mt-1">{passwordErrors.confirmPassword.message}</p>}
            </div>
          </div>
          <button
            onClick={handlePasswordSubmit(onPasswordUpdate)}
            disabled={loadingPassword}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white py-2.5 rounded-xl font-bold transition shadow-sm active:scale-[0.98]"
          >
            {loadingPassword ? "Saving..." : "Update Password"}
          </button>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-gray-400 shrink-0" />
              <div>
                <h2 className="font-bold text-sm md:text-base text-gray-700">Email Notifications</h2>
                <p className="text-[10px] md:text-xs text-gray-400">Get notified about new blood requests</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-all shrink-0 ${notifications ? 'bg-red-500' : 'bg-gray-200'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-all mx-0.5 ${notifications ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-5 md:p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Trash2 size={16} className="text-red-400" />
            <h2 className="font-bold text-sm md:text-base text-red-500">Danger Zone</h2>
          </div>
          <p className="text-[10px] md:text-xs text-gray-400 leading-relaxed">
            Once you delete your account, there is no going back. All your data will be permanently removed.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2.5 rounded-xl font-bold transition active:scale-[0.98]"
          >
            Delete My Account
          </button>
        </div>

      </div>
    </Layout>
  );
};

export default SettingsPage;