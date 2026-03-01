import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Award, Heart, Crown } from 'lucide-react';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast';

const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
const medalLabels = ['🥇', '🥈', '🥉'];

const getBadge = (count) => {
  if (count >= 10) return { label: 'Elite', color: '#fbbf24' };
  if (count >= 5)  return { label: 'Hero',  color: '#f87171' };
  if (count >= 1)  return { label: 'Active', color: '#60a5fa' };
  return null;
};

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const myId = parseInt(localStorage.getItem("user_id"));

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    axios.get('http://localhost:5000/api/donations/leaderboard', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setLeaders(res.data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      toast.error("Failed to load leaderboard");
    });
  }, []);

  // Find current user's rank
  const myRank = leaders.findIndex(l => l.id === myId) + 1;
  const myEntry = leaders.find(l => l.id === myId);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-2 md:px-0">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
            <Trophy size={22} className="text-yellow-500" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-800">Leaderboard</h1>
            <p className="text-xs md:text-sm text-gray-400">Top blood donors making a difference</p>
          </div>
        </div>

        {/* My rank card (if user is in leaderboard) */}
        {myEntry && (
          <div className="bg-gradient-to-r from-red-500 to-red-400 rounded-2xl p-4 md:p-5 mb-6 text-white shadow-lg shadow-red-200">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Your Rank</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black">#{myRank}</span>
                <div>
                  <p className="font-bold text-sm">{myEntry.fullName}</p>
                  <p className="text-[10px] opacity-75">{myEntry.donationCount} donation{myEntry.donationCount !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
                <img src={`https://ui-avatars.com/api/?name=${myEntry.fullName}&background=ef4444&color=fff`} alt="me" />
              </div>
            </div>
          </div>
        )}

        {/* Top 3 podium */}
        {!loading && leaders.length >= 3 && (
          <div className="flex items-end justify-center gap-3 mb-8">
            {/* 2nd place */}
            <PodiumCard donor={leaders[1]} rank={2} />
            {/* 1st place */}
            <PodiumCard donor={leaders[0]} rank={1} tall />
            {/* 3rd place */}
            <PodiumCard donor={leaders[2]} rank={3} />
          </div>
        )}

        {/* Full list */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse h-16" />
            ))}
          </div>
        ) : leaders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm">
            <Heart size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No donations yet</p>
            <p className="text-gray-300 text-xs mt-1">Be the first to donate and top the board!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {leaders.map((donor, i) => {
              const badge = getBadge(donor.donationCount);
              const isMe = donor.id === myId;
              return (
                <div
                  key={donor.id}
                  className={`flex items-center gap-3 md:gap-4 p-4 rounded-2xl border transition-colors ${
                    isMe
                      ? 'bg-red-50 border-red-200'
                      : 'bg-white border-gray-100 hover:border-red-100'
                  }`}
                >
                  {/* Rank */}
                  <div className="w-8 text-center shrink-0">
                    {i < 3
                      ? <span className="text-lg">{medalLabels[i]}</span>
                      : <span className="text-xs font-black text-gray-400">#{i + 1}</span>
                    }
                  </div>

                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-100 shrink-0">
                    <img
                      src={`https://ui-avatars.com/api/?name=${donor.fullName}&background=f87171&color=fff`}
                      alt={donor.fullName}
                    />
                  </div>

                  {/* Name + badge */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`font-bold text-sm truncate ${isMe ? 'text-red-600' : 'text-gray-800'}`}>
                        {donor.fullName} {isMe && <span className="text-[10px] font-normal">(You)</span>}
                      </p>
                      {badge && (
                        <span
                          className="text-[8px] font-black px-1.5 py-0.5 rounded-full shrink-0"
                          style={{ backgroundColor: `${badge.color}20`, color: badge.color }}
                        >
                          {badge.label}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400">{donor.bloodGroup} · {donor.donationCount} donation{donor.donationCount !== 1 ? 's' : ''}</p>
                  </div>

                  {/* Lives saved */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-gray-800">{donor.donationCount}</p>
                    <p className="text-[9px] text-gray-400">lives</p>
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

const PodiumCard = ({ donor, rank, tall }) => {
  const colors = { 1: 'bg-yellow-400', 2: 'bg-gray-300', 3: 'bg-orange-300' };
  return (
    <div className={`flex flex-col items-center gap-2 ${tall ? 'mb-0' : 'mb-4'}`}>
      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
        <img src={`https://ui-avatars.com/api/?name=${donor.fullName}&background=f87171&color=fff`} alt={donor.fullName} />
      </div>
      <p className="text-[10px] font-bold text-gray-700 truncate max-w-[70px] text-center">{donor.fullName}</p>
      <p className="text-[9px] text-gray-400">{donor.donationCount} donations</p>
      <div className={`${colors[rank]} ${tall ? 'h-16' : 'h-10'} w-16 rounded-t-xl flex items-center justify-center text-white font-black text-lg shadow-sm`}>
        {rank === 1 ? <Crown size={20} /> : `#${rank}`}
      </div>
    </div>
  );
};

export default Leaderboard;