import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Droplets } from 'lucide-react';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast'; // Added toast

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
      }).catch(() => {
        setLoading(false);
        toast.error("Failed to load nearby requests");
      });
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
      <div className="max-w-4xl mx-auto px-2 md:px-0">

        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
            <MapPin size={22} className="text-orange-500" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-800">Nearby Requests</h1>
            <p className="text-xs md:text-sm text-gray-400">Find blood requests by location</p>
          </div>
        </div>

        {/* Search - Adjusted padding for mobile */}
        <div className="relative mb-6">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search by hospital or location..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 bg-white shadow-sm transition-all"
          />
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20 animate-pulse">Loading requests...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 md:p-16 text-center shadow-sm">
            <Droplets size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium text-sm md:text-base">No requests found for that location</p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {filtered.map(req => {
              const myId = parseInt(localStorage.getItem("user_id"));
              return (
                <div key={req.id} className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-red-100 transition-colors">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-red-50 rounded-xl flex items-center justify-center font-black text-red-500 text-xs md:text-sm shrink-0">
                      {req.bloodGroup}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-800 text-sm md:text-base truncate">{req.patientName}</p>
                      <p className="text-[10px] md:text-xs text-gray-400 flex items-center gap-1 truncate">
                        <MapPin size={10} className="shrink-0"/> {req.hospitalLocation} · {req.unitsNeeded} units
                      </p>
                      <p className="text-[10px] text-gray-300 mt-0.5">{new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end sm:block">
                    {req.requesterId === myId ? (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] md:text-xs font-medium whitespace-nowrap">
                        Your Request
                      </span>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold whitespace-nowrap ${
                        req.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {req.status === 'pending' ? 'Pending' : 'Fulfilled'}
                      </span>
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

export default Nearby;