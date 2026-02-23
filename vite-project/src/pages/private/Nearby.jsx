import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Droplets } from 'lucide-react';
import Layout from '../../components/Layout';

const Nearby = () => {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/requests/all')
      .then(res => {
        setRequests(res.data);
        setFiltered(res.data);
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    setFiltered(requests.filter(r => 
      r.hospitalLocation.toLowerCase().includes(val.toLowerCase())
    ));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <MapPin size={24} className="text-orange-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-800">Nearby Requests</h1>
            <p className="text-sm text-gray-400">Find blood requests by location</p>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search by hospital or location..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 mb-6 bg-white shadow-sm"
        />

        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <Droplets size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No requests found for that location</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(req => {
              const myId = parseInt(localStorage.getItem("user_id"));
              return (
                <div key={req.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center font-black text-red-500 text-sm">
                      {req.bloodGroup}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{req.patientName}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin size={10}/> {req.hospitalLocation} · {req.unitsNeeded} units
                      </p>
                      <p className="text-xs text-gray-300 mt-0.5">{new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {req.requesterId === myId ? (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">Your Request</span>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      req.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {req.status === 'pending' ? 'Pending' : 'Fulfilled'}
                    </span>
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

export default Nearby;