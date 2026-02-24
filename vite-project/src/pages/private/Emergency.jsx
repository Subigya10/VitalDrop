import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, Droplets } from 'lucide-react';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast'; // Added toast

const Emergency = () => {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/requests/all')
      .then(res => {
        setRequests(res.data);
        setFiltered(res.data);
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  const handleFilter = (group) => {
    setSelectedGroup(group);
    if (group === 'All') {
      setFiltered(requests);
    } else {
      setFiltered(requests.filter(r => r.bloodGroup === group));
    }
  };

  const handleRespond = async (requestId) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.patch(`http://localhost:5000/api/requests/accept/${requestId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success("You accepted this request! Go save a life! 🩸"); // Replaced alert
      
      const res = await axios.get('http://localhost:5000/api/requests/all');
      setRequests(res.data);
      setFiltered(selectedGroup === 'All' ? res.data : res.data.filter(r => r.bloodGroup === selectedGroup));
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error(err.response.data.message); // Replaced alert
      } else {
        toast.error("Failed to accept request. Try again!"); // Replaced alert
      }
    }
  };

  const bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
            <AlertCircle size={24} className="text-red-500" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-800">Emergency Requests</h1>
            <p className="text-xs sm:text-sm text-gray-400">Urgent blood requests near you</p>
          </div>
        </div>

        {/* Blood Group Filter - Improved touch responsiveness */}
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
          <div className="text-center text-gray-400 py-10 sm:py-20 animate-pulse">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-16 text-center shadow-sm">
            <Droplets size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No urgent requests</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filtered.map(req => {
              const myId = parseInt(localStorage.getItem("user_id"));
              const isMyRequest = req.requesterId === myId;
              return (
                <div key={req.id} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:border-red-100 transition-colors">
                  <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 rounded-xl flex items-center justify-center font-black text-red-500 text-xs sm:text-sm shrink-0">
                      {req.bloodGroup}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-gray-800 truncate text-sm sm:text-base">{req.patientName}</p>
                      <p className="text-[10px] sm:text-xs text-gray-400 truncate">{req.hospitalLocation} · {req.unitsNeeded} units</p>
                      <p className="text-[10px] text-gray-300 mt-0.5">{new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="w-full sm:w-auto flex justify-end">
                    {isMyRequest ? (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-medium">Your Request</span>
                    ) : (
                      <button onClick={() => handleRespond(req.id)}
                        className="bg-red-500 text-white px-4 py-2 sm:px-5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold hover:bg-red-600 transition shadow-sm w-full sm:w-auto">
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