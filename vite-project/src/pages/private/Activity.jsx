import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { History, Droplets, HandHeart } from 'lucide-react';
import Layout from '../../components/Layout.jsx';

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
    }).catch(() => setLoading(false));
  }, []);

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <History size={24} className="text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-800">My Activity</h1>
            <p className="text-sm text-gray-400">Your blood requests history</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading...</div>
        ) : myRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <Droplets size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No activity yet</p>
            <p className="text-gray-300 text-sm mt-1">Your blood requests will show up here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myRequests.map(req => (
              <div key={req.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center font-black text-red-500 text-sm">
                    {req.bloodGroup}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{req.patientName}</p>
                    <p className="text-xs text-gray-400">{req.hospitalLocation} · {req.unitsNeeded} units</p>
                    <p className="text-xs text-gray-300 mt-0.5">{new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  req.status === 'pending' 
                    ? 'bg-yellow-100 text-yellow-600' 
                    : 'bg-green-100 text-green-600'
                }`}>
                  {req.status === 'pending' ? 'Pending' : 'Fulfilled'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </Layout>
  );
};

export default Activity;