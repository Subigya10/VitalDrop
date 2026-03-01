import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Droplets, TrendingUp } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const urgencyColor = (count, max) => {
  const ratio = max > 0 ? count / max : 0;
  if (ratio > 0.6) return { bar: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-50', label: 'Critical' };
  if (ratio > 0.3) return { bar: 'bg-orange-400', text: 'text-orange-600', bg: 'bg-orange-50', label: 'Needed' };
  return { bar: 'bg-green-400', text: 'text-green-600', bg: 'bg-green-50', label: 'Low' };
};

const BloodStatsWidget = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/requests/all')
      .then(res => {
        // Count pending requests per blood group
        const pending = res.data.filter(r => r.status === 'pending');
        const counts = BLOOD_GROUPS.map(group => ({
          group,
          count: pending.filter(r => r.bloodGroup === group).length,
        }));
        setStats(counts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const max = Math.max(...stats.map(s => s.count), 1);
  const totalPending = stats.reduce((sum, s) => sum + s.count, 0);
  const mostNeeded = stats.reduce((a, b) => (a.count > b.count ? a : b), { group: '—', count: 0 });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Droplets size={18} className="text-red-500" />
          <h3 className="font-bold text-gray-800 text-sm md:text-base">Blood Demand</h3>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-gray-400">
          <TrendingUp size={12} />
          <span>{totalPending} pending</span>
        </div>
      </div>

      {/* Most needed callout */}
      {mostNeeded.count > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2 mb-4 flex items-center justify-between">
          <span className="text-[10px] text-red-500 font-bold">🔴 Most Needed</span>
          <span className="text-sm font-black text-red-600">{mostNeeded.group}</span>
        </div>
      )}

      {/* Bar chart */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-6 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2.5">
          {stats
            .slice()
            .sort((a, b) => b.count - a.count)
            .map(({ group, count }) => {
              const colors = urgencyColor(count, max);
              const pct = max > 0 ? (count / max) * 100 : 0;
              return (
                <div key={group} className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-gray-600 w-7 shrink-0">{group}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${colors.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-1 w-16 justify-end">
                    <span className="text-[10px] font-bold text-gray-500">{count}</span>
                    {count > 0 && (
                      <span className={`text-[8px] font-bold px-1 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                        {colors.label}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {totalPending === 0 && !loading && (
        <p className="text-center text-xs text-gray-300 mt-2">No pending requests right now 🎉</p>
      )}
    </div>
  );
};

export default BloodStatsWidget;