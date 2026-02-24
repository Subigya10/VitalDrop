import React, { useState } from 'react';
import axios from 'axios';
import { Settings, Lock, Mail, Bell, Moon, Trash2 } from 'lucide-react';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const [email, setEmail] = useState(localStorage.getItem("username") || "");
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState('');

  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("access_token");

  const handleEmailUpdate = async () => {
    try {
      setLoading('email');
      await axios.patch(`http://localhost:5000/api/users/${userId}`, 
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Email updated successfully!");
    } catch (err) {
      toast.error("Failed to update email!");
    } finally {
      setLoading('');
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords don't match!"); return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters!"); return;
    }
    try {
      setLoading('password');
      await axios.patch(`http://localhost:5000/api/users/${userId}`,
        { password: passwords.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswords({ newPassword: '', confirmPassword: '' });
      toast.success("Password updated successfully!");
    } catch (err) {
      toast.error("Failed to update password!");
    } finally {
      setLoading('');
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

        {/* Header - Responsive alignment */}
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
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 transition-all"
          />
          <button onClick={handleEmailUpdate} disabled={loading === 'email'}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-2.5 rounded-xl font-bold transition shadow-md active:scale-[0.98]">
            {loading === 'email' ? "Saving..." : "Update Email"}
          </button>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-gray-400" />
            <h2 className="font-bold text-sm md:text-base text-gray-700">Change Password</h2>
          </div>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="New Password"
              value={passwords.newPassword}
              onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 transition-all"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={passwords.confirmPassword}
              onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 transition-all"
            />
          </div>
          <button onClick={handlePasswordUpdate} disabled={loading === 'password'}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-2.5 rounded-xl font-bold transition shadow-md active:scale-[0.98]">
            {loading === 'password' ? "Saving..." : "Update Password"}
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
            <button onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-all shrink-0 ${notifications ? 'bg-red-500' : 'bg-gray-200'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-all mx-0.5 ${notifications ? 'translate-x-6' : 'translate-x-0'}`}/>
            </button>
          </div>
        </div>

        {/* Dark Mode */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 opacity-70">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Moon size={18} className="text-gray-400 shrink-0" />
              <div>
                <h2 className="font-bold text-sm md:text-base text-gray-700">Dark Mode</h2>
                <p className="text-[10px] md:text-xs text-gray-400">Coming soon in next update!</p>
              </div>
            </div>
            <button disabled
              className="w-12 h-6 rounded-full bg-gray-200 cursor-not-allowed">
              <div className="w-5 h-5 bg-white rounded-full shadow mx-0.5"/>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-5 md:p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Trash2 size={16} className="text-red-400" />
            <h2 className="font-bold text-sm md:text-base text-red-500">Danger Zone</h2>
          </div>
          <p className="text-[10px] md:text-xs text-gray-400 leading-relaxed">Once you delete your account, there is no going back. All your data will be permanently removed.</p>
          <button onClick={handleDeleteAccount}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2.5 rounded-xl font-bold transition active:scale-[0.98]">
            Delete My Account
          </button>
        </div>

      </div>
    </Layout>
  );
};

export default SettingsPage;