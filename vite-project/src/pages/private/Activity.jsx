import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { History, Droplets, Heart } from 'lucide-react';
import Layout from '../../components/Layout.jsx';
import toast from 'react-hot-toast';
import { SkeletonList } from '../../components/SkeletonCard';

const STATUS_STYLES = {
  pending:   'bg-yellow-100 text-yellow-600',
  accepted:  'bg-green-100 text-green-600',
  fulfilled: 'bg-green-100 text-green-600',
  approved:  'bg-green-100 text-green-600',
  completed: 'bg-green-100 text-green-600',
  scheduled: 'bg-blue-100 text-blue-600',
  rejected:  'bg-red-100 text-red-600',
  cancelled: 'bg-gray-100 text-gray-500',
};

const STATUS_LABELS = {
  pending:   '⏳ Pending',
  accepted:  '✅ Accepted',
  fulfilled: '✅ Fulfilled',
  approved:  '✅ Approved',
  completed: '✅ Completed',
  scheduled: '📅 Scheduled',
  rejected:  '❌ Rejected',
  cancelled: '❌ Cancelled',
};

const StatusBadge = ({ status }) => (
  <span className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold whitespace-nowrap capitalize ${STATUS_STYLES[status] || 'bg-gray-100 text-gray-400'}`}>
    {STATUS_LABELS[status] || status}
  </span>
);

const Activity = () => {
  const [tab, setTab] = useState('requests');
  const [myRequests, setMyRequests] = useState([]);
  const [myDonations, setMyDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    Promise.all([
      axios.get('http://localhost:5000/api/requests/my',  { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('http://localhost:5000/api/donations/my', { headers: { Authorization: `Bearer ${token}` } }),
    ]).then(([reqRes, donRes]) => {
      setMyRequests(reqRes.data);
      setMyDonations(donRes.data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      toast.error("Failed to load activity history");
    });
  }, []);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-2 md:px-0">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
            <History size={22} className="text-red-500" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-800">My Activity</h1>
            <p className="text-xs md:text-sm text-gray-400">Your requests and donations history</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('requests')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              tab === 'requests' ? 'bg-red-500 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-400'
            }`}>
            📋 My Requests {myRequests.length > 0 && `(${myRequests.length})`}
          </button>
          <button
            onClick={() => setTab('donations')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              tab === 'donations' ? 'bg-red-500 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-400'
            }`}>
            🩸 My Donations {myDonations.length > 0 && `(${myDonations.length})`}
          </button>
        </div>

        {loading ? (
          <SkeletonList count={4} />
        ) : tab === 'requests' ? (

          myRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 md:p-16 text-center shadow-sm">
              <Droplets size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No requests yet</p>
              <p className="text-gray-300 text-xs md:text-sm mt-1">Your blood requests will show up here</p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {myRequests.map(req => (
                <div key={req.id} className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-red-50 rounded-xl flex items-center justify-center font-black text-red-500 text-xs md:text-sm shrink-0">
                      {req.bloodGroup}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-800 text-sm md:text-base truncate">{req.patientName}</p>
                      <p className="text-[10px] md:text-xs text-gray-400 truncate">
                        {req.hospitalLocation} · {req.unitsNeeded} units
                      </p>
                      <p className="text-[10px] text-gray-300 mt-0.5">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end sm:block shrink-0">
                    <StatusBadge status={req.status} />
                  </div>
                </div>
              ))}
            </div>
          )

        ) : (

          myDonations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 md:p-16 text-center shadow-sm">
              <Heart size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No donations yet</p>
              <p className="text-gray-300 text-xs md:text-sm mt-1">Your scheduled donations will show up here</p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {myDonations.map(don => (
                <div key={don.id} className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-red-50 rounded-xl flex items-center justify-center font-black text-red-500 text-xs md:text-sm shrink-0">
                      {don.bloodGroup}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-800 text-sm md:text-base truncate">{don.hospital}</p>
                      <p className="text-[10px] md:text-xs text-gray-400 truncate">
                        📅 {new Date(don.date).toDateString()}
                      </p>
                      <p className="text-[10px] text-gray-300 mt-0.5">
                        Scheduled on {new Date(don.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end sm:block shrink-0">
                    <StatusBadge status={don.status} />
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </Layout>
  );
};

export default Activity;