import React from 'react';
import { X, MapPin, Droplets, User, Phone, Calendar, AlertCircle, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

const RequestDetailModal = ({ request, onClose, onRespond }) => {
  if (!request) return null;

  const handleShare = () => {
    const text = `🩸 Urgent Blood Request!\nPatient: ${request.patientName}\nBlood Group: ${request.bloodGroup}\nLocation: ${request.hospitalLocation}\nUnits Needed: ${request.unitsNeeded}\n\nPlease help if you can!`;
    
    if (navigator.share) {
      navigator.share({ title: 'Urgent Blood Request', text });
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Request details copied to clipboard!");
    }
  };

  const myId = parseInt(localStorage.getItem("user_id"));
  const isMyRequest = request.requesterId === myId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
        
        {/* Top banner */}
        <div className="bg-gradient-to-r from-red-500 to-red-400 p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="opacity-80" />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Urgent Request</span>
            </div>
            <button onClick={onClose} className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition">
              <X size={14} />
            </button>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-black">{request.bloodGroup}</p>
              <p className="text-sm font-bold opacity-90">{request.unitsNeeded} units needed</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Droplets size={28} className="text-white" />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          
          <DetailRow icon={<User size={15} className="text-gray-400" />} label="Patient" value={request.patientName} />
          <DetailRow icon={<MapPin size={15} className="text-orange-400" />} label="Hospital" value={request.hospitalLocation} />
          <DetailRow
            icon={<Calendar size={15} className="text-gray-400" />}
            label="Requested"
            value={new Date(request.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          />
          {request.requesterPhone && (
            <DetailRow
              icon={<Phone size={15} className="text-green-500" />}
              label="Contact"
              value={
                <a href={`tel:${request.requesterPhone}`} className="text-red-500 font-bold hover:underline">
                  {request.requesterPhone}
                </a>
              }
            />
          )}
          {request.message && (
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Additional Info</p>
              <p className="text-sm text-gray-600">{request.message}</p>
            </div>
          )}

          {/* Status badge */}
          <div className="flex items-center justify-between pt-2">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
              request.status === 'pending'
                ? 'bg-yellow-100 text-yellow-600'
                : 'bg-green-100 text-green-600'
            }`}>
              {request.status === 'pending' ? '⏳ Pending' : '✅ Fulfilled'}
            </span>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition font-medium"
            >
              <Share2 size={13} /> Share
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition active:scale-95"
          >
            Close
          </button>
          {!isMyRequest && request.status === 'pending' && (
            <button
              onClick={() => { onRespond(request.id); onClose(); }}
              className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-600 transition shadow-md shadow-red-100 active:scale-95"
            >
              Respond 🩸
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
    </div>
  </div>
);

export default RequestDetailModal;