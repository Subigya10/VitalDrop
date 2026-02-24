import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { History, Droplets } from 'lucide-react';
import Layout from '../../components/Layout.jsx';
import toast from 'react-hot-toast'; // Added toast

const Activity = () => {
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    axios.get('http://localhost:5000/api/requests/my', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setMyRequests(res.data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      toast.error("Failed to load activity history");
    });
  }, []);

  return (
    <Layout>
      {/* Removed hardcoded min-h-screen and p-8 to prevent double-scrollbars and margin issues */}
      <div className="max-w-3xl mx-auto px-2 md:px-0">

        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
            <History size={22} className="text-red-500" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-800">My Activity</h1>
            <p className="text-xs md:text-sm text-gray-400">Your blood requests history</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-10 md:py-20 animate-pulse">Loading history...</div>
        ) : myRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 md:p-16 text-center shadow-sm">
            <Droplets size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No activity yet</p>
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
                
                {/* Status Badge - aligned to right on mobile */}
                <div className="flex justify-end sm:block">
                  <span className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold whitespace-nowrap ${
                    req.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-600' 
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {req.status === 'pending' ? 'Pending' : 'Fulfilled'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Activity;