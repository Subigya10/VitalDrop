import React, { useState } from 'react';
import axios from 'axios';

const RequestModal = ({ isOpen, onClose, onRefresh }) => {
  // 1. Updated state to include a default Blood Group and correct field naming
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: 'A+', // Default value prevents empty selection errors
    unitsNeeded: 1,
    hospitalLocation: '', // Renamed to match your Sequelize Model
  });

  if (!isOpen) return null;

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('access_token');
    console.log("TOKEN FROM STORAGE:", token); // ← ADD THIS

      // 2. Add the headers to the axios call
      const response = await axios.post('http://localhost:5000/api/requests', formData, {
        headers: {
          Authorization: `Bearer ${token}` // This matches your verifyToken middleware
        }
      });
      
      if (response.status === 201 || response.status === 200) {
        alert("Emergency Request Posted!");
        
        setFormData({
          patientName: '',
          bloodGroup: 'A+',
          unitsNeeded: 1,
          hospitalLocation: '',
        });

        if (onRefresh) onRefresh();
        onClose();
      }
    } catch (err) {
      console.error("Error saving request:", err);
      // If the error is 401, it means the token is missing or invalid
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
      } else {
        alert("Failed to save. Check your Backend Terminal!");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Request Blood</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700">Patient Name</label>
            <input 
              type="text" 
              value={formData.patientName}
              className="w-full border border-gray-200 p-3 rounded-xl mt-1 focus:ring-2 focus:ring-red-500 outline-none transition-all" 
              onChange={(e) => setFormData({...formData, patientName: e.target.value})}
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Blood Group */}
            <div>
              <label className="block text-sm font-bold text-gray-700">Blood Group</label>
              <select 
                value={formData.bloodGroup}
                className="w-full border border-gray-200 p-3 rounded-xl mt-1 focus:ring-2 focus:ring-red-500 outline-none appearance-none bg-white"
                onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
              >
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
              </select>
            </div>
            
            {/* Units Needed */}
            <div>
              <label className="block text-sm font-bold text-gray-700">Units Needed</label>
              <input 
                type="number" 
                value={formData.unitsNeeded}
                className="w-full border border-gray-200 p-3 rounded-xl mt-1 focus:ring-2 focus:ring-red-500 outline-none" 
                onChange={(e) => setFormData({...formData, unitsNeeded: e.target.value})}
                min="1" 
                required
              />
            </div>
          </div>

          {/* Hospital & Location */}
          <div>
            <label className="block text-sm font-bold text-gray-700">Hospital & Location</label>
            <input 
              type="text" 
              value={formData.hospitalLocation}
              placeholder="e.g. Patan Hospital"
              className="w-full border border-gray-200 p-3 rounded-xl mt-1 focus:ring-2 focus:ring-red-500 outline-none transition-all" 
              onChange={(e) => setFormData({...formData, hospitalLocation: e.target.value})}
              required 
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-3 font-bold text-gray-400 hover:text-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 shadow-lg shadow-red-100 active:scale-95 transition-all"
            >
              Post Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestModal;