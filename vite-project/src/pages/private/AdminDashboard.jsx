import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users, Droplets, Heart, CheckCircle, XCircle,
  Trash2, ShieldCheck, LayoutDashboard, Menu, X,
  LogOut, Plus, UserCog, Eye, EyeOff, ClipboardList
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const API = 'http://localhost:5000/api';
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('access_token')}` });

const statusColor = {
  scheduled: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  completed:  'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled:  'bg-red-500/20 text-red-400 border-red-500/30',
  pending:    'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  accepted:   'bg-green-500/20 text-green-400 border-green-500/30',
  approved:   'bg-green-500/20 text-green-400 border-green-500/30',
  rejected:   'bg-red-500/20 text-red-400 border-red-500/30',
};

const colorMap = {
  blue:   'bg-blue-500/20 text-blue-400',
  red:    'bg-red-500/20 text-red-400',
  yellow: 'bg-yellow-500/20 text-yellow-400',
  green:  'bg-green-500/20 text-green-400',
};

const urgencyConfig = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  moderate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  normal:   'bg-green-500/20 text-green-400 border-green-500/30',
};

const urgencyLabel = {
  critical: '🔴 Critical',
  moderate: '🟡 Moderate',
  normal:   '🟢 Normal',
};

/* ── Add User Modal ── */
const AddUserModal = ({ onClose, onAdded }) => {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', bloodGroup: '', role: 'user' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.fullName || !form.email || !form.password) {
      toast.error('Name, email and password are required'); return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/users`, form, { headers: headers() });
      toast.success('User created!');
      onAdded();
      onClose();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to create user');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Add New User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Full Name', key: 'fullName', type: 'text',  placeholder: 'John Doe' },
            { label: 'Email',     key: 'email',    type: 'email', placeholder: 'john@example.com' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-semibold text-gray-400 mb-1.5 block">{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full bg-gray-800 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500" />
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Password</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="w-full bg-gray-800 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 pr-10" />
              <button onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Blood Group</label>
            <select value={form.bloodGroup} onChange={e => setForm(p => ({ ...p, bloodGroup: e.target.value }))}
              className="w-full bg-gray-800 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500">
              <option value="">Select blood group</option>
              {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Role</label>
            <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
              className="w-full bg-gray-800 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm font-medium transition-colors">Cancel</button>
          <button onClick={submit} disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors disabled:opacity-50">
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Confirm Delete Modal ── */
const ConfirmModal = ({ message, onConfirm, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-sm p-6">
      <p className="text-white font-semibold text-center mb-2">Are you sure?</p>
      <p className="text-gray-400 text-sm text-center mb-6">{message}</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm font-medium">Cancel</button>
        <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold">Delete</button>
      </div>
    </div>
  </div>
);

/* ── Sidebar ── */
const TABS = [
  { label: 'Overview',       icon: <LayoutDashboard size={18} /> },
  { label: 'Users',          icon: <Users size={18} /> },
  { label: 'Donations',      icon: <Heart size={18} /> },
  { label: 'Blood Requests', icon: <Droplets size={18} /> },
];

const Sidebar = ({ tab, setTab, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-base leading-none">VitalDrop</p>
            <p className="text-red-400 text-[11px] font-semibold mt-0.5">Admin Panel</p>
          </div>
        </div>
        {onClose && <button onClick={onClose} className="text-gray-400 hover:text-white lg:hidden"><X size={20} /></button>}
      </div>
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {TABS.map(item => (
          <button key={item.label} onClick={() => { setTab(item.label); onClose?.(); }}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 text-left ${
              tab === item.label ? 'bg-red-600 text-white shadow-lg shadow-red-600/25' : 'text-gray-400 hover:text-white hover:bg-white/[0.08]'
            }`}>
            {item.icon}{item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <button onClick={() => { logout(); navigate('/login'); }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 font-medium text-sm transition-all">
          <LogOut size={18} />Logout
        </button>
      </div>
    </div>
  );
};

/* ── Main ── */
const AdminDashboard = () => {
  const [tab, setTab]               = useState('Overview');
  const [menuOpen, setMenuOpen]     = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [users, setUsers]           = useState([]);
  const [donations, setDonations]   = useState([]);
  const [bloodRequests, setBloodRequests] = useState([]);
  const [stats, setStats]           = useState(null);
  const [loading, setLoading]       = useState(true);

  useEffect(() => { fetchAll(); }, []);

  // FIX: use /requests/all instead of /requests
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [u, d, r] = await Promise.all([
        axios.get(`${API}/users`,         { headers: headers() }),
        axios.get(`${API}/donations`,     { headers: headers() }),
        axios.get(`${API}/requests/all`,  { headers: headers() }), // ✅ fixed endpoint
      ]);
      setUsers(u.data);
      setDonations(d.data);
      setBloodRequests(r.data);
      setStats({
        totalUsers:         u.data.length,
        totalDonations:     d.data.length,
        pendingRequests:    r.data.filter(x => x.status === 'pending').length,
        completedDonations: d.data.filter(x => x.status === 'completed').length,
      });
    } catch { toast.error('Failed to load data'); }
    setLoading(false);
  };

  // FIX: all deletes now call fetchAll() instead of manually filtering
  const deleteUser     = async (id) => { await axios.delete(`${API}/users/${id}`, { headers: headers() }); fetchAll(); toast.success('User deleted'); };
  const toggleRole     = async (u)  => { const r = u.role === 'admin' ? 'user' : 'admin'; await axios.patch(`${API}/users/${u.userId}`, { role: r }, { headers: headers() }); setUsers(p => p.map(x => x.userId === u.userId ? { ...x, role: r } : x)); toast.success(`${u.fullName} is now ${r}`); };
  const updateDonation = async (id, status) => { await axios.patch(`${API}/donations/${id}`, { status }, { headers: headers() }); setDonations(p => p.map(x => x.id === id ? { ...x, status } : x)); toast.success('Updated'); };
  const deleteDonation = async (id) => { await axios.delete(`${API}/donations/${id}`, { headers: headers() }); fetchAll(); toast.success('Donation deleted'); }; // ✅ fixed
  const updateRequest  = async (id, status) => { await axios.patch(`${API}/requests/${id}`, { status }, { headers: headers() }); setBloodRequests(p => p.map(x => x.id === id ? { ...x, status } : x)); toast.success('Updated'); };
  const deleteRequest  = async (id) => { await axios.delete(`${API}/requests/${id}`, { headers: headers() }); fetchAll(); toast.success('Request deleted'); }; // ✅ fixed

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    const { type, id } = confirmDelete;
    try {
      if (type === 'user')     await deleteUser(id);
      if (type === 'donation') await deleteDonation(id);
      if (type === 'request')  await deleteRequest(id);
    } catch { toast.error('Failed to delete'); }
    setConfirmDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <aside className="hidden lg:flex flex-col w-64 bg-gray-900 border-r border-white/10 fixed h-full z-20">
        <Sidebar tab={tab} setTab={setTab} />
      </aside>

      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-64 bg-gray-900 border-r border-white/10 flex flex-col">
            <Sidebar tab={tab} setTab={setTab} onClose={() => setMenuOpen(false)} />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMenuOpen(false)} />
        </div>
      )}

      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-gray-900 border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center"><ShieldCheck size={15} className="text-white" /></div>
          <span className="text-white font-bold text-sm">VitalDrop Admin</span>
        </div>
        <button onClick={() => setMenuOpen(true)} className="text-gray-400 hover:text-white"><Menu size={22} /></button>
      </div>

      {showAddUser && <AddUserModal onClose={() => setShowAddUser(false)} onAdded={fetchAll} />}
      {confirmDelete && (
        <ConfirmModal
          message={`This will permanently delete this ${confirmDelete.type}. This cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onClose={() => setConfirmDelete(null)}
        />
      )}

      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 max-w-6xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{tab}</h1>
              <p className="text-gray-500 text-sm mt-0.5">
                {tab === 'Overview'       && 'Platform summary at a glance'}
                {tab === 'Users'          && `${users.length} registered users`}
                {tab === 'Donations'      && `${donations.length} total donations`}
                {tab === 'Blood Requests' && `${bloodRequests.length} total requests`}
              </p>
            </div>
            {tab === 'Users' && (
              <button onClick={() => setShowAddUser(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors">
                <Plus size={16} />Add User
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* OVERVIEW */}
              {tab === 'Overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={<Users size={22} />}         color="blue"   label="Total Users"      value={stats?.totalUsers} />
                    <StatCard icon={<Heart size={22} />}         color="red"    label="Total Donations"  value={stats?.totalDonations} />
                    <StatCard icon={<ClipboardList size={22} />} color="yellow" label="Pending Requests" value={stats?.pendingRequests} />
                    <StatCard icon={<CheckCircle size={22} />}   color="green"  label="Completed"        value={stats?.completedDonations} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <RecentCard title="Recent Donations"      items={donations.slice(0,5).map(d => ({ key: d.id, name: d.donorName, sub: `${d.hospital} · ${d.bloodGroup}`, status: d.status }))} />
                    <RecentCard title="Recent Blood Requests" items={bloodRequests.slice(0,5).map(r => ({ key: r.id, name: r.patientName, sub: `${r.hospitalLocation} · ${r.bloodGroup}`, status: r.status, urgency: r.urgency }))} />
                  </div>
                </div>
              )}

              {/* USERS */}
              {tab === 'Users' && (
                <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          {['Name','Email','Blood Group','Role','Actions'].map(h => (
                            <th key={h} className="text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider px-5 py-4">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.userId} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName||'U')}&background=dc2626&color=fff&size=32`} className="w-8 h-8 rounded-full" alt="" />
                                <span className="text-sm font-semibold text-white">{u.fullName}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-sm text-gray-400">{u.email}</td>
                            <td className="px-5 py-3.5">
                              {u.bloodGroup
                                ? <span className="bg-red-600/20 text-red-400 border border-red-600/30 text-xs font-bold px-2.5 py-1 rounded-lg">{u.bloodGroup}</span>
                                : <span className="text-gray-600">—</span>}
                            </td>
                            <td className="px-5 py-3.5">
                              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${u.role === 'admin' ? 'bg-purple-600/20 text-purple-400 border-purple-600/30' : 'bg-gray-700/50 text-gray-400 border-white/5'}`}>
                                {u.role || 'user'}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-1">
                                <button onClick={() => toggleRole(u)} title={u.role === 'admin' ? 'Demote to user' : 'Promote to admin'}
                                  className="p-1.5 text-gray-600 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors">
                                  <UserCog size={15} />
                                </button>
                                <button onClick={() => setConfirmDelete({ type: 'user', id: u.userId })}
                                  className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {users.length === 0 && <EmptyRow cols={5} />}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* DONATIONS */}
              {tab === 'Donations' && (
                <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          {['Donor','Blood','Hospital','Date','Status','Actions'].map(h => (
                            <th key={h} className="text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider px-5 py-4">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {donations.map(d => (
                          <tr key={d.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                            <td className="px-5 py-3.5 text-sm font-semibold text-white">{d.donorName}</td>
                            <td className="px-5 py-3.5"><span className="bg-red-600/20 text-red-400 border border-red-600/30 text-xs font-bold px-2.5 py-1 rounded-lg">{d.bloodGroup}</span></td>
                            <td className="px-5 py-3.5 text-sm text-gray-400">{d.hospital}</td>
                            <td className="px-5 py-3.5 text-sm text-gray-400">{new Date(d.date).toLocaleDateString()}</td>
                            <td className="px-5 py-3.5"><span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${statusColor[d.status]||'bg-gray-700 text-gray-400 border-white/5'}`}>{d.status}</span></td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-1">
                                {d.status !== 'completed' && (
                                  <button onClick={() => updateDonation(d.id, 'completed')} title="Mark completed"
                                    className="p-1.5 text-gray-600 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"><CheckCircle size={15} /></button>
                                )}
                                {d.status !== 'cancelled' && (
                                  <button onClick={() => updateDonation(d.id, 'cancelled')} title="Cancel"
                                    className="p-1.5 text-gray-600 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors"><XCircle size={15} /></button>
                                )}
                                <button onClick={() => setConfirmDelete({ type: 'donation', id: d.id })} title="Delete"
                                  className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={15} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {donations.length === 0 && <EmptyRow cols={6} />}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* BLOOD REQUESTS */}
              {tab === 'Blood Requests' && (
                <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          {['Patient','Blood','Units','Hospital','Urgency','Status','Actions'].map(h => (
                            <th key={h} className="text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider px-5 py-4">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bloodRequests
                          .sort((a, b) => {
                            const order = { critical: 0, moderate: 1, normal: 2 };
                            return (order[a.urgency] ?? 2) - (order[b.urgency] ?? 2);
                          })
                          .map(r => (
                          <tr key={r.id} className={`border-b border-white/5 hover:bg-white/[0.03] transition-colors ${r.urgency === 'critical' ? 'bg-red-500/5' : ''}`}>
                            <td className="px-5 py-3.5 text-sm font-semibold text-white">{r.patientName}</td>
                            <td className="px-5 py-3.5"><span className="bg-red-600/20 text-red-400 border border-red-600/30 text-xs font-bold px-2.5 py-1 rounded-lg">{r.bloodGroup}</span></td>
                            <td className="px-5 py-3.5 text-sm text-gray-400">{r.unitsNeeded}</td>
                            <td className="px-5 py-3.5 text-sm text-gray-400">{r.hospitalLocation}</td>
                            {/* ✅ NEW: Urgency column */}
                            <td className="px-5 py-3.5">
                              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${urgencyConfig[r.urgency] || urgencyConfig.normal}`}>
                                {urgencyLabel[r.urgency] || '🟢 Normal'}
                              </span>
                            </td>
                            <td className="px-5 py-3.5"><span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${statusColor[r.status]||'bg-gray-700 text-gray-400 border-white/5'}`}>{r.status}</span></td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-1">
                                {r.status === 'pending' && (
                                  <>
                                    <button onClick={() => updateRequest(r.id, 'approved')} title="Approve"
                                      className="p-1.5 text-gray-600 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"><CheckCircle size={15} /></button>
                                    <button onClick={() => updateRequest(r.id, 'rejected')} title="Reject"
                                      className="p-1.5 text-gray-600 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors"><XCircle size={15} /></button>
                                  </>
                                )}
                                <button onClick={() => setConfirmDelete({ type: 'request', id: r.id })} title="Delete"
                                  className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={15} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {bloodRequests.length === 0 && <EmptyRow cols={7} />}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ icon, color, label, value }) => (
  <div className="bg-gray-900 border border-white/10 rounded-2xl p-5">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${colorMap[color]}`}>{icon}</div>
    <p className="text-3xl font-bold text-white">{value ?? '—'}</p>
    <p className="text-xs text-gray-500 mt-1">{label}</p>
  </div>
);

const RecentCard = ({ title, items }) => (
  <div className="bg-gray-900 border border-white/10 rounded-2xl p-5">
    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">{title}</p>
    <div className="space-y-3">
      {items.length === 0 && <p className="text-gray-600 text-sm">No data yet</p>}
      {items.map(item => (
        <div key={item.key} className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{item.name}</p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{item.sub}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {item.urgency && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${urgencyConfig[item.urgency] || urgencyConfig.normal}`}>
                {urgencyLabel[item.urgency] || '🟢'}
              </span>
            )}
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${statusColor[item.status]||'bg-gray-700 text-gray-400 border-white/5'}`}>{item.status}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EmptyRow = ({ cols }) => (
  <tr><td colSpan={cols} className="text-center text-gray-600 py-12 text-sm">No data found</td></tr>
);

export default AdminDashboard;