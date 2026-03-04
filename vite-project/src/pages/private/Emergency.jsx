import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, Droplets } from 'lucide-react';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast';

const URGENCY_CONFIG = {
  critical: { label: '🔴 Critical', bg: 'bg-red-100',    text: 'text-red-600',    border: 'border-red-200',    order: 0 },
  moderate: { label: '🟡 Moderate', bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200', order: 1 },
  normal:   { label: '🟢 Normal',   bg: 'bg-green-100',  text: 'text-green-600',  border: 'border-green-200',  order: 2 },
};

const UrgencyBadge = ({ urgency }) => {
  const cfg = URGENCY_CONFIG[urgency] || URGENCY_CONFIG.normal;
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  );
};

// Toast confirmation helper
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

const Emergency = () => {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [loading, setLoading] = useState(true);

  const sortByUrgency = (data) => [...data].sort((a, b) => {
    const orderA = (URGENCY_CONFIG[a.urgency] || URGENCY_CONFIG.normal).order;
    const orderB = (URGENCY_CONFIG[b.urgency] || URGENCY_CONFIG.normal).order;
    return orderA - orderB;
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/requests/all')
      .then(res => {
        const sorted = sortByUrgency(res.data);
        setRequests(sorted);
        setFiltered(sorted);
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  const handleFilter = (group) => {
    setSelectedGroup(group);
    const base = group === 'All' ? requests : requests.filter(r => r.bloodGroup === group);
    setFiltered(sortByUrgency(base));
  };

  const handleRespond = async (requestId) => {
    const confirmed = await confirmToast('Respond to this request? You are committing to donate. 🩸');
    if (!confirmed) return;
    try {
      const token = localStorage.getItem('access_token');
      await axios.patch(`http://localhost:5000/api/requests/accept/${requestId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('You accepted this request! Go save a life! 🩸');
      const res = await axios.get('http://localhost:5000/api/requests/all');
      const sorted = sortByUrgency(res.data);
      setRequests(sorted);
      setFiltered(selectedGroup === 'All' ? sorted : sortByUrgency(sorted.filter(r => r.bloodGroup === selectedGroup)));
    } catch (err) {
      if (err.response?.status === 400) toast.error(err.response.data.message);
      else toast.error('Failed to accept request. Try again!');
    }
  };

  const bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Count critical requests
  const criticalCount = filtered.filter(r => r.urgency === 'critical').length;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
            <AlertCircle size={24} className="text-red-500" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-black text-gray-800">Emergency Requests</h1>
            <p className="text-xs sm:text-sm text-gray-400">Urgent blood requests — sorted by priority</p>
          </div>
          {criticalCount > 0 && (
            <div className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold animate-pulse shadow-md shadow-red-200">
              🔴 {criticalCount} Critical
            </div>
          )}
        </div>

        {/* Blood Group Filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {bloodGroups.map(group => (
            <button key={group} onClick={() => handleFilter(group)}
              className={`px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition whitespace-nowrap ${
                selectedGroup === group
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-red-300'
              }`}>
              {group}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-10 animate-pulse">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
            <Droplets size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No urgent requests</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filtered.map(req => {
              const myId = parseInt(localStorage.getItem('user_id'));
              const isMyRequest = req.requesterId === myId;
              const isCritical = req.urgency === 'critical';
              return (
                <div key={req.id}
                  className={`bg-white rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm transition-colors ${
                    isCritical ? 'border-red-200 bg-red-50/30' : 'border-gray-100 hover:border-red-100'
                  }`}>
                  <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-black text-xs sm:text-sm shrink-0 ${isCritical ? 'bg-red-100 text-red-600' : 'bg-red-50 text-red-500'}`}>
                      {req.bloodGroup}
                    </div>
                    <div className="overflow-hidden flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="font-bold text-gray-800 text-sm sm:text-base">{req.patientName}</p>
                        <UrgencyBadge urgency={req.urgency} />
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-400 truncate">{req.hospitalLocation} · {req.unitsNeeded} units</p>
                      <p className="text-[10px] text-gray-300 mt-0.5">{new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto flex justify-end">
                    {isMyRequest ? (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-medium">Your Request</span>
                    ) : (
                      <button onClick={() => handleRespond(req.id)}
                        className={`px-4 py-2 sm:px-5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold transition shadow-sm w-full sm:w-auto text-white ${
                          isCritical ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-red-500 hover:bg-red-600'
                        }`}>
                        Respond 🩸
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Emergency;