import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { 
  LayoutDashboard, AlertCircle, Heart, MapPin, 
  History, Trophy, User, Settings, LogOut,
  PlusCircle, Users, Bell, Award, CheckCircle, Menu, X 
} from 'lucide-react';
import RequestModal from './Requestblood';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const username = localStorage.getItem("username") || "User";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [requestsData, setRequestsData] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [myRequests, setMyRequests] = useState([]);
  const [livesSaved, setLivesSaved] = useState(0);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/requests/all');
      setRequestsData(response.data);
    } catch (error) {
      console.error("Error fetching blood requests:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("access_token");

    axios.get('http://localhost:5000/api/requests/donations/count', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setLivesSaved(res.data.count)).catch(() => {});
    
    axios.get(`http://localhost:5000/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUserProfile(res.data)).catch(() => {});

    axios.get('http://localhost:5000/api/requests/my', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setMyRequests(res.data)).catch(() => {});
  }, []);

  const handleRespond = async (requestId) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.patch(`http://localhost:5000/api/requests/accept/${requestId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("You accepted this request! Go save a life! 🩸");
      fetchRequests();
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to accept request. Try again!");
      }
    }
  };

  const columns = [
    { name: 'Date', selector: row => new Date(row.createdAt).toLocaleDateString(), sortable: true, hide: 'sm' },
    { name: 'Patient', selector: row => row.patientName, sortable: true },
    { name: 'Location', selector: row => row.hospitalLocation, hide: 'md' },
    { name: 'Group', selector: row => row.bloodGroup, width: '70px', center: "true" },
    { name: 'Units', selector: row => row.unitsNeeded, center: "true", width: '70px', hide: 'sm' },
    { 
      name: 'Status', 
      cell: row => {
        const myId = parseInt(localStorage.getItem("user_id"));
        if (row.requesterId === myId) {
          return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-[10px] font-medium">Your Request</span>;
        }
        return row.status === 'pending' ? 
          <button 
            className="bg-red-500 text-white px-3 py-1 rounded-lg text-[10px] font-bold hover:bg-red-600 transition shadow-sm"
            onClick={() => handleRespond(row.id)} 
          >Respond</button> :
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px] font-medium">Done</span>
      }
    },
  ];

  const customStyles = {
    headCells: { style: { fontWeight: 'bold', color: '#374151', backgroundColor: '#f9fafb' } },
    cells: { style: { padding: '8px' } },
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans relative">
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-40 transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="p-6 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
              <Heart size={18} className="text-red-500 fill-red-500" />
            </div>
            <span className="text-xl font-black text-gray-800 tracking-tight">VitalDrop</span>
          </div>
          <button className="lg:hidden text-gray-400" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <SidebarItem to="/dashboard" icon={<LayoutDashboard size={20}/>} label="Dashboard" />
          <SidebarItem to="/emergency" icon={<AlertCircle size={20}/>} label="Emergency" color="text-red-500" />
          <SidebarItem to="/donate" icon={<Heart size={20}/>} label="Donate" />
          <SidebarItem to="/nearby" icon={<MapPin size={20}/>} label="Nearby" />
          <SidebarItem to="/activity" icon={<History size={20}/>} label="My Activity" />
          <SidebarItem to="/profile" icon={<User size={20}/>} label="Profile" />
          <SidebarItem to="/settings" icon={<Settings size={20}/>} label="Settings" />
        </nav>

        <div className="p-4 border-t border-gray-50">
          <button 
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-red-600 transition-colors text-sm font-medium"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8">
        
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 bg-white rounded-lg shadow-sm" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Welcome, <span className="text-red-500">{userProfile?.fullName || username}!</span>
            </h1>
          </div>
          
          <div className="flex items-center justify-between md:justify-end gap-4">
            {/* Urgent bell → goes to /emergency */}
            <button
              onClick={() => navigate('/emergency')}
              className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-200 text-xs md:text-sm hover:bg-red-700 transition active:scale-95"
            >
              <Bell size={16} className="animate-pulse" /> Urgent
            </button>
            <div className="flex items-center gap-2 border-l pl-4">
              <span className="hidden sm:inline text-xs font-bold text-gray-600 uppercase">{userProfile?.fullName || username}</span>
              <div
                className="w-9 h-9 bg-red-100 rounded-full border-2 border-white shadow-sm overflow-hidden cursor-pointer"
                onClick={() => navigate('/profile')}
                title="Go to Profile"
              >
                <img src={`https://ui-avatars.com/api/?name=${userProfile?.fullName || username}&background=f87171&color=fff`} alt="user" />
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-12 gap-6 md:gap-8">
          
          {/* LEFT SECTION */}
          <div className="col-span-12 lg:col-span-9 space-y-6 md:space-y-8">
            
            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
              <CardBtn
                icon={<PlusCircle size={24}/>}
                label="Request Blood"
                color="bg-red-500"
                onClick={() => setIsModalOpen(true)}
              />
              <CardBtn
                icon={<Heart size={24}/>}
                label="Donate Blood"
                color="bg-teal-500"
                onClick={() => navigate('/donate')}
              />
              <CardBtn
                icon={<MapPin size={24}/>}
                label="Nearby Requests"
                color="bg-orange-400"
                onClick={() => navigate('/nearby')}
              />
              <CardBtn
                icon={<Users size={24}/>}
                label="Become Volunteer"
                color="bg-blue-500"
                onClick={() => navigate('/activity')}
              />
            </div>

            {/* STATUS CARDS */}
            <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-gray-700">My Status</h3>
                <div className="flex justify-between text-sm text-gray-500">
                  Total Requests: <span className="font-bold text-gray-800">{myRequests.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 flex items-center gap-1 font-medium"><CheckCircle size={14}/> Eligible</span> 
                  <span className="font-bold text-green-600">Yes</span>
                </div>
                {/* Donate Now → /donate */}
                <button
                  onClick={() => navigate('/donate')}
                  className="w-full bg-red-500 text-white py-2 rounded-lg font-bold mt-2 hover:bg-red-600 transition shadow-md active:scale-95"
                >
                  Donate Now
                </button>
              </div>
              <div className="bg-gray-50 py-6 rounded-xl flex flex-col items-center justify-center border border-gray-100">
                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Your Group</span>
                <span className="text-4xl md:text-5xl font-black text-gray-800">
                  {userProfile?.bloodGroup || "—"}
                </span>
              </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-50">
                <h2 className="font-bold text-gray-800 text-sm md:text-base">Urgent Blood Requests</h2>
              </div>
              <div className="overflow-x-auto">
                <DataTable 
                  columns={columns} 
                  data={requestsData} 
                  customStyles={customStyles} 
                  highlightOnHover 
                  responsive
                  noDataComponent={<div className="p-10 text-gray-400 text-sm">No pending requests found.</div>}
                />
              </div>
            </div>
          </div>

          {/* RIGHT SECTION (IMPACT) */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
              <h3 className="font-bold text-gray-800 mb-4">Your Impact</h3>
              <div className="mb-6 flex flex-row lg:flex-col justify-between items-end lg:items-start">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Lives Saved</p>
                  <span className="text-4xl font-black text-gray-800">{livesSaved}</span>
                </div>
              </div>
              <div className="space-y-3">
                <Feedback text="Thank you for saving my brother's life!" />
                <Feedback text="We are forever grateful!" />
              </div>
              <div className="mt-8 pt-6 border-t flex justify-around">
                <Badge color="#f87171" label="Hero" />
                <Badge color="#60a5fa" label="Active" />
                <Badge color="#fbbf24" label="Elite" />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <RequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchRequests}
      />
    </div>
  );
};

// HELPER COMPONENTS
const SidebarItem = ({ icon, label, to, color }) => (
  <NavLink to={to} className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-red-50 text-red-600 shadow-sm' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'} ${color}`}>
    {icon} {label}
  </NavLink>
);

const CardBtn = ({ icon, label, color, onClick }) => (
  <div onClick={onClick} className={`${color} text-white p-4 md:p-6 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center gap-2 md:gap-3 cursor-pointer hover:scale-105 transition shadow-lg active:scale-95`}>
    <div className="bg-white/20 p-2 rounded-lg">{icon}</div>
    <span className="text-[10px] md:text-xs font-bold text-center leading-tight">{label}</span>
  </div>
);

const Feedback = ({ text }) => (
  <div className="bg-red-50 p-3 rounded-xl border border-red-100">
    <p className="text-[10px] md:text-[11px] italic text-gray-600">"{text}"</p>
  </div>
);

const Badge = ({ color, label }) => (
  <div className="flex flex-col items-center gap-1">
    <div className="p-2 bg-white rounded-full border shadow-sm"><Award size={16} color={color}/></div>
    <span className="text-[8px] md:text-[9px] font-black text-gray-300 uppercase tracking-tighter">{label}</span>
  </div>
);

export default Dashboard;