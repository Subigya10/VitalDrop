import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, AlertCircle, Heart, MapPin, 
  History, User, Settings, LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-20">
        <div className="p-6 mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
            <Heart size={18} className="text-red-500 fill-red-500" />
          </div>
          <span className="text-xl font-black text-gray-800 tracking-tight">VitalDrop</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem to="/dashboard" icon={<LayoutDashboard size={20}/>} label="Dashboard" />
          <SidebarItem to="/emergency" icon={<AlertCircle size={20}/>} label="Emergency" />
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

      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, to }) => (
  <NavLink to={to} className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-red-50 text-red-600 shadow-sm' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}>
    {icon} {label}
  </NavLink>
);

export default Layout;