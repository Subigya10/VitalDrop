import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, Droplets } from 'lucide-react';
import Layout from '../../components/Layout';

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
      alert("You accepted this request! Go save a life! 🩸");
      const res = await axios.get('http://localhost:5000/api/requests/all');
      setRequests(res.data);
      setFiltered(selectedGroup === 'All' ? res.data : res.data.filter(r => r.bloodGroup === selectedGroup));
    } catch (err) {
      if (err.response?.status === 400) {
        alert(err.response.data.message);
      } else {
        alert("Failed to accept request. Try again!");
      }
    }
  };

  const bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle size={24} className="text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-800">Emergency Requests</h1>
            <p className="text-sm text-gray-400">Urgent blood requests near you</p>
          </div>
        </div>

        {/* Blood Group Filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {bloodGroups.map(group => (
            <button key={group} onClick={() => handleFilter(group)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                selectedGroup === group 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-red-300'
              }`}>
              {group}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <Droplets size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No urgent requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(req => {
              const myId = parseInt(localStorage.getItem("user_id"));
              const isMyRequest = req.requesterId === myId;
              return (
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
                  {isMyRequest ? (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">Your Request</span>
                  ) : (
                    <button onClick={() => handleRespond(req.id)}
                      className="bg-red-500 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-red-600 transition shadow-sm">
                      Respond 🩸
                    </button>
                  )}
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