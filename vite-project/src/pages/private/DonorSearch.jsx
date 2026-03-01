import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Phone, MapPin, Droplets, User } from 'lucide-react';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast';

const bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const DonorSearch = () => {
  const [donors, setDonors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    axios.get('http://localhost:5000/api/users/donors', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setDonors(res.data);
      setFiltered(res.data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      toast.error("Failed to load donors");
    });
  }, []);

  const applyFilters = (group, searchVal) => {
    let result = donors;
    if (group !== 'All') result = result.filter(d => d.bloodGroup === group);
    if (searchVal.trim()) {
      const lower = searchVal.toLowerCase();
      result = result.filter(d =>
        d.fullName?.toLowerCase().includes(lower) ||
        d.address?.toLowerCase().includes(lower)
      );
    }
    setFiltered(result);
  };

  const handleGroupFilter = (group) => {
    setSelectedGroup(group);
    applyFilters(group, search);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    applyFilters(selectedGroup, e.target.value);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-2 md:px-0">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
            <Search size={22} className="text-red-500" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-800">Find Donors</h1>
            <p className="text-xs md:text-sm text-gray-400">Search for blood donors by group or location</p>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search by name or location..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 bg-white shadow-sm"
          />
        </div>

        {/* Blood group filter chips */}
        <div className="flex gap-2 flex-wrap mb-6">
          {bloodGroups.map(group => (
            <button
              key={group}
              onClick={() => handleGroupFilter(group)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition whitespace-nowrap ${
                selectedGroup === group
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-red-300'
              }`}
            >
              {group}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-xs text-gray-400 mb-4">
            {filtered.length} donor{filtered.length !== 1 ? 's' : ''} found
          </p>
        )}

        {/* Donor list */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse h-20" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 md:p-16 text-center shadow-sm">
            <Droplets size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No donors found</p>
            <p className="text-gray-300 text-xs mt-1">Try a different blood group or location</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {filtered.map(donor => (
              <div key={donor.userId} className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 flex items-center gap-4 shadow-sm hover:border-red-100 transition-colors">
                
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-red-100 shrink-0">
                  <img
                    src={`https://ui-avatars.com/api/?name=${donor.fullName}&background=f87171&color=fff`}
                    alt={donor.fullName}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-gray-800 text-sm truncate">{donor.fullName}</p>
                    <span className="bg-red-50 text-red-600 font-black text-xs px-2 py-0.5 rounded-lg shrink-0">
                      {donor.bloodGroup}
                    </span>
                  </div>
                  {donor.address && (
                    <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1 truncate">
                      <MapPin size={10} className="text-orange-400 shrink-0" /> {donor.address}
                    </p>
                  )}
                  {donor.phoneNumber && (
                    <a
                      href={`tel:${donor.phoneNumber}`}
                      className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 hover:text-red-600 transition"
                    >
                      <Phone size={10} /> {donor.phoneNumber}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DonorSearch;