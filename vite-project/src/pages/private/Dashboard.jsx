import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import {
  PlusCircle, Bell, Award, CheckCircle,
  Search, Trophy, Trash2, Pencil, XCircle, X,
  Heart, MapPin, AlertTriangle
} from 'lucide-react';
import RequestModal from './Requestblood';
import RequestDetailModal from '../../components/RequestDetailModal';
import BloodStatsWidget from '../../components/Bloodstatswidget';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast';

const confirmToast = (message) => new Promise((resolve) => {
  toast((t) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#111827' }}>{message}</p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => { toast.dismiss(t.id); resolve(true); }}
          style={{ flex: 1, padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>Yes</button>
        <button onClick={() => { toast.dismiss(t.id); resolve(false); }}
          style={{ flex: 1, padding: '6px 12px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
      </div>
    </div>
  ), { duration: Infinity, style: { padding: '16px', borderRadius: '14px' } });
});

const API = 'http://localhost:5000/api';
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('access_token')}` });

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

/* ── Urgency Badge ── */
const URGENCY_CONFIG = {
  critical: { label: '🔴 Critical', bg: 'bg-red-100',    text: 'text-red-600' },
  moderate: { label: '🟡 Moderate', bg: 'bg-yellow-100', text: 'text-yellow-600' },
  normal:   { label: '🟢 Normal',   bg: 'bg-green-100',  text: 'text-green-600' },
};

const UrgencyBadge = ({ urgency }) => {
  if (!urgency) return null;
  const cfg = URGENCY_CONFIG[urgency] || URGENCY_CONFIG.normal;
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  );
};

/* ── Edit Request Modal ── */
const EditRequestModal = ({ request, onClose, onSaved }) => {
  const [form, setForm] = useState({
    patientName:      request.patientName,
    bloodGroup:       request.bloodGroup,
    unitsNeeded:      request.unitsNeeded,
    hospitalLocation: request.hospitalLocation,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  const validate = () => {
    const e = {};
    if (!form.patientName.trim())      e.patientName = 'Patient name is required';
    if (!form.bloodGroup)              e.bloodGroup = 'Blood group is required';
    if (!form.unitsNeeded || form.unitsNeeded < 1) e.unitsNeeded = 'At least 1 unit required';
    if (!form.hospitalLocation.trim()) e.hospitalLocation = 'Hospital is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await axios.patch(`${API}/requests/${request.id}`, form, { headers: authHeaders() });
      toast.success('Request updated!');
      onSaved();
      onClose();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-800 text-lg">Edit Blood Request</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="space-y-4">
          <Field label="Patient Name" error={errors.patientName}>
            <input value={form.patientName} onChange={e => setForm(p => ({ ...p, patientName: e.target.value }))}
              className={`input ${errors.patientName ? 'border-red-300 bg-red-50' : ''}`} placeholder="Patient name" />
          </Field>
          <Field label="Blood Group" error={errors.bloodGroup}>
            <select value={form.bloodGroup} onChange={e => setForm(p => ({ ...p, bloodGroup: e.target.value }))}
              className={`input ${errors.bloodGroup ? 'border-red-300 bg-red-50' : ''}`}>
              <option value="">Select</option>
              {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </Field>
          <Field label="Units Needed" error={errors.unitsNeeded}>
            <input type="number" value={form.unitsNeeded}
              onChange={e => setForm(p => ({ ...p, unitsNeeded: parseInt(e.target.value) }))}
              className={`input ${errors.unitsNeeded ? 'border-red-300 bg-red-50' : ''}`} min={1} max={20} />
          </Field>
          <Field label="Hospital / Location" error={errors.hospitalLocation}>
            <input value={form.hospitalLocation} onChange={e => setForm(p => ({ ...p, hospitalLocation: e.target.value }))}
              className={`input ${errors.hospitalLocation ? 'border-red-300 bg-red-50' : ''}`} placeholder="Hospital name" />
          </Field>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50">Cancel</button>
          <button onClick={submit} disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, error, children }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500 mb-1.5 block">{label}</label>
    {children}
    {error && <p className="text-red-500 text-[11px] mt-1">{error}</p>}
  </div>
);

/* ── My Requests Card ── */
const MyRequestsCard = ({ requests, onDelete, onEdit, onCancel }) => {
  if (requests.length === 0) return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-bold text-gray-700 mb-3 text-sm">My Blood Requests</h3>
      <p className="text-gray-300 text-sm">You haven't made any requests yet.</p>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50">
        <h3 className="font-bold text-gray-700 text-sm">My Blood Requests</h3>
      </div>
      <div className="divide-y divide-gray-50">
        {requests.map(r => (
          <div key={r.id} className="px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-800 text-sm truncate">{r.patientName}</span>
                <span className="text-[10px] font-bold bg-red-50 text-red-500 px-2 py-0.5 rounded-full">{r.bloodGroup}</span>
                <StatusBadge status={r.status} />
                <UrgencyBadge urgency={r.urgency} />
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{r.hospitalLocation} · {r.unitsNeeded} unit{r.unitsNeeded > 1 ? 's' : ''}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {r.status === 'pending' && (
                <>
                  <button onClick={() => onEdit(r)} title="Edit"
                    className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => onCancel(r.id)} title="Cancel"
                    className="p-1.5 text-gray-300 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors">
                    <XCircle size={14} />
                  </button>
                </>
              )}
              <button onClick={() => onDelete(r.id)} title="Delete"
                className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── My Donations Card ── */
const MyDonationsCard = ({ donations }) => {
  if (donations.length === 0) return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-bold text-gray-700 mb-3 text-sm">My Donations</h3>
      <p className="text-gray-300 text-sm">No donations yet. Start saving lives!</p>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50">
        <h3 className="font-bold text-gray-700 text-sm">My Donations</h3>
      </div>
      <div className="divide-y divide-gray-50">
        {donations.map(d => (
          <div key={d.id} className="px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-800 text-sm truncate">{d.hospital}</span>
                <span className="text-[10px] font-bold bg-red-50 text-red-500 px-2 py-0.5 rounded-full">{d.bloodGroup}</span>
                <StatusBadge status={d.status} />
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{new Date(d.date).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    pending:   'bg-yellow-100 text-yellow-600',
    accepted:  'bg-green-100 text-green-600',
    approved:  'bg-green-100 text-green-600',
    rejected:  'bg-red-100 text-red-600',
    cancelled: 'bg-gray-100 text-gray-500',
    scheduled: 'bg-blue-100 text-blue-600',
    completed: 'bg-green-100 text-green-600',
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${styles[status] || 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  );
};

/* ── Main Dashboard ── */
const Dashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';

  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editingRequest, setEditingRequest]   = useState(null);

  const [requestsData, setRequestsData] = useState([]);
  const [myRequests, setMyRequests]     = useState([]);
  const [myDonations, setMyDonations]   = useState([]);
  const [userProfile, setUserProfile]   = useState(null);
  const [livesSaved, setLivesSaved]     = useState(0);

  const fetchAll = async () => {
    const uid = localStorage.getItem('user_id');
    try {
      const [allReqs, myReqs, myDons, profile, lives] = await Promise.allSettled([
        axios.get(`${API}/requests/all`),
        axios.get(`${API}/requests/my`,              { headers: authHeaders() }),
        axios.get(`${API}/donations/my`,             { headers: authHeaders() }),
        axios.get(`${API}/users/${uid}`,             { headers: authHeaders() }),
        axios.get(`${API}/requests/donations/count`, { headers: authHeaders() }),
      ]);
      if (allReqs.status  === 'fulfilled') {
        // Sort by urgency: critical first
        const urgencyOrder = { critical: 0, moderate: 1, normal: 2 };
        const sorted = [...allReqs.value.data].sort((a, b) =>
          (urgencyOrder[a.urgency] ?? 2) - (urgencyOrder[b.urgency] ?? 2)
        );
        setRequestsData(sorted);
      }
      if (myReqs.status   === 'fulfilled') setMyRequests(myReqs.value.data);
      if (myDons.status   === 'fulfilled') setMyDonations(myDons.value.data);
      if (profile.status  === 'fulfilled') setUserProfile(profile.value.data);
      if (lives.status    === 'fulfilled') setLivesSaved(lives.value.data.count);
    } catch {}
  };

  useEffect(() => { fetchAll(); }, []);

  const lastDonation = myDonations
    .filter(d => d.status === 'completed' || d.status === 'approved')
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  const eligible = isEligible(lastDonation?.date);
  const daysLeft = daysUntilEligible(lastDonation?.date);

  const handleRespond = async (requestId) => {
    const confirmed = await confirmToast('Respond to this request? This means you are committing to donate. 🩸');
    if (!confirmed) return;
    try {
      await axios.patch(`${API}/requests/accept/${requestId}`, {}, { headers: authHeaders() });
      toast.success('You accepted this request! Go save a life! 🩸');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept request');
    }
  };

  const handleDeleteRequest = async (id) => {
    const confirmed = await confirmToast('Delete this request? This cannot be undone.');
    if (!confirmed) return;
    try {
      await axios.delete(`${API}/requests/${id}`, { headers: authHeaders() });
      setMyRequests(p => p.filter(r => r.id !== id));
      toast.success('Request deleted');
    } catch { toast.error('Failed to delete request'); }
  };

  const handleCancelRequest = async (id) => {
    const confirmed = await confirmToast('Cancel this request?');
    if (!confirmed) return;
    try {
      await axios.patch(`${API}/requests/${id}`, { status: 'cancelled' }, { headers: authHeaders() });
      setMyRequests(p => p.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));
      fetchAll();
      toast.success('Request cancelled');
    } catch { toast.error('Failed to cancel request'); }
  };

  const getBadge = () => {
    if (livesSaved >= 10) return { label: 'Elite',  color: '#fbbf24' };
    if (livesSaved >= 5)  return { label: 'Hero',   color: '#f87171' };
    if (livesSaved >= 1)  return { label: 'Active', color: '#60a5fa' };
    return null;
  };
  const earnedBadge = getBadge();

  const columns = [
    { name: 'Date',     selector: row => new Date(row.createdAt).toLocaleDateString(), sortable: true, hide: 'sm' },
    {
      name: 'Patient',
      cell: row => (
        <button className="font-semibold text-gray-800 hover:text-red-500 transition text-left text-sm"
          onClick={() => setSelectedRequest(row)}>
          {row.patientName}
        </button>
      ),
      sortable: true,
    },
    { name: 'Location', selector: row => row.hospitalLocation, hide: 'md' },
    { name: 'Group',    selector: row => row.bloodGroup, width: '70px', center: true },
    {
      name: 'Urgency',
      cell: row => <UrgencyBadge urgency={row.urgency} />,
      width: '110px',
      hide: 'sm',
    },
    {
      name: 'Status',
      cell: row => {
        const myId = parseInt(localStorage.getItem('user_id'));
        if (row.requesterId === myId) return (
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-[10px] font-medium">Your Request</span>
        );
        return row.status === 'pending'
          ? <button className="bg-red-500 text-white px-3 py-1 rounded-lg text-[10px] font-bold hover:bg-red-600 transition shadow-sm"
              onClick={() => handleRespond(row.id)}>Respond</button>
          : <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px] font-medium">Done</span>;
      },
    },
  ];

  const customStyles = {
    headCells: { style: { fontWeight: 'bold', color: '#374151', backgroundColor: '#f9fafb' } },
    cells:     { style: { padding: '8px' } },
    rows:      { style: { cursor: 'pointer' } },
  };

  return (
    <Layout>
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Welcome, <span className="text-red-500">{userProfile?.fullName || username}!</span>
        </h1>
        <div className="flex items-center justify-between md:justify-end gap-4">
          <button onClick={() => navigate('/emergency')}
            className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-200 text-xs md:text-sm hover:bg-red-700 transition active:scale-95">
            <Bell size={16} className="animate-pulse" /> Urgent
          </button>
          <div className="flex items-center gap-2 border-l pl-4">
            <span className="hidden sm:inline text-xs font-bold text-gray-600 uppercase">{userProfile?.fullName || username}</span>
            <div className="w-9 h-9 bg-red-100 rounded-full border-2 border-white shadow-sm overflow-hidden cursor-pointer" onClick={() => navigate('/profile')}>
              <img src={`https://ui-avatars.com/api/?name=${userProfile?.fullName || username}&background=f87171&color=fff`} alt="user" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 md:gap-8">
        <div className="col-span-12 lg:col-span-9 space-y-6 md:space-y-8">

          {/* Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            <CardBtn icon={<PlusCircle size={24}/>} label="Request Blood"   color="bg-red-500"    onClick={() => setIsModalOpen(true)} />
            <CardBtn icon={<Heart size={24}/>}      label="Donate Blood"    color="bg-teal-500"   onClick={() => navigate('/donate')} />
            <CardBtn icon={<MapPin size={24}/>}     label="Nearby Requests" color="bg-orange-400" onClick={() => navigate('/nearby')} />
            <CardBtn icon={<Search size={24}/>}     label="Find Donors"     color="bg-blue-500"   onClick={() => navigate('/donors')} />
          </div>

          {/* Status Cards */}
          <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-700">My Status</h3>
              <div className="flex justify-between text-sm text-gray-500">
                Total Requests: <span className="font-bold text-gray-800">{myRequests.length}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                Total Donations: <span className="font-bold text-gray-800">{myDonations.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                {eligible ? (
                  <>
                    <span className="text-green-600 flex items-center gap-1 font-medium"><CheckCircle size={14}/> Eligible to Donate</span>
                    <span className="font-bold text-green-600">Yes</span>
                  </>
                ) : (
                  <>
                    <span className="text-orange-500 flex items-center gap-1 font-medium"><AlertTriangle size={14}/> Not Eligible Yet</span>
                    <span className="font-bold text-orange-500">{daysLeft}d left</span>
                  </>
                )}
              </div>
              <button onClick={() => navigate('/donate')} disabled={!eligible}
                className="w-full bg-red-500 text-white py-2 rounded-lg font-bold mt-2 hover:bg-red-600 transition shadow-md active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none">
                {eligible ? 'Donate Now' : `Eligible in ${daysLeft} days`}
              </button>
            </div>
            <div className="bg-gray-50 py-6 rounded-xl flex flex-col items-center justify-center border border-gray-100">
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Your Group</span>
              <span className="text-4xl md:text-5xl font-black text-gray-800">{userProfile?.bloodGroup || '—'}</span>
            </div>
          </div>

          {/* My Requests + My Donations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MyRequestsCard requests={myRequests} onDelete={handleDeleteRequest} onEdit={r => setEditingRequest(r)} onCancel={handleCancelRequest} />
            <MyDonationsCard donations={myDonations} />
          </div>

          {/* All Requests Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-bold text-gray-800 text-sm md:text-base">Urgent Blood Requests</h2>
              <span className="text-[10px] text-gray-400">Sorted by urgency · Click a name for details</span>
            </div>
            <div className="overflow-x-auto">
              <DataTable
                columns={columns}
                data={requestsData}
                customStyles={customStyles}
                onRowClicked={row => setSelectedRequest(row)}
                highlightOnHover
                responsive
                noDataComponent={<div className="p-10 text-gray-400 text-sm">No pending requests found.</div>}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <BloodStatsWidget />
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Your Impact</h3>
            <div className="mb-6">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Lives Saved</p>
              {livesSaved === 0
                ? <p className="text-sm text-gray-300 mt-1">Donate to start saving lives!</p>
                : <span className="text-4xl font-black text-gray-800">{livesSaved}</span>}
            </div>
            {earnedBadge ? (
              <div className="flex flex-col items-center gap-2 py-4 bg-yellow-50 rounded-xl border border-yellow-100 mb-4">
                <div className="p-2 bg-white rounded-full border shadow-sm">
                  <Award size={20} color={earnedBadge.color} />
                </div>
                <span className="text-xs font-black text-gray-600 uppercase tracking-wider">{earnedBadge.label} Donor</span>
                <span className="text-[10px] text-gray-400">{livesSaved} donation{livesSaved !== 1 ? 's' : ''} completed</span>
              </div>
            ) : (
              <div className="py-4 bg-gray-50 rounded-xl border border-gray-100 mb-4 text-center">
                <p className="text-[11px] text-gray-400">Complete your first donation to earn a badge!</p>
              </div>
            )}
            <button onClick={() => navigate('/leaderboard')}
              className="w-full mt-2 border border-gray-200 text-gray-500 py-2 rounded-xl text-xs font-bold hover:border-yellow-300 hover:text-yellow-600 transition">
              🏆 View Leaderboard
            </button>
          </div>
        </div>
      </div>

      <RequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={fetchAll} />
      {selectedRequest && <RequestDetailModal request={selectedRequest} onClose={() => setSelectedRequest(null)} onRespond={handleRespond} />}
      {editingRequest && <EditRequestModal request={editingRequest} onClose={() => setEditingRequest(null)} onSaved={fetchAll} />}

      <style>{`.input { width: 100%; background: #f9fafb; border: 1px solid #e5e7eb; color: #111827; border-radius: 0.75rem; padding: 0.625rem 1rem; font-size: 0.875rem; outline: none; box-sizing: border-box; } .input:focus { border-color: #ef4444; }`}</style>
    </Layout>
  );
};

const CardBtn = ({ icon, label, color, onClick }) => (
  <div onClick={onClick} className={`${color} text-white p-4 md:p-6 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center gap-2 md:gap-3 cursor-pointer hover:scale-105 transition shadow-lg active:scale-95`}>
    <div className="bg-white/20 p-2 rounded-lg">{icon}</div>
    <span className="text-[10px] md:text-xs font-bold text-center leading-tight">{label}</span>
  </div>
);

export default Dashboard;