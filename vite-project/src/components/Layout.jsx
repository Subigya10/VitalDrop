import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, AlertCircle, Heart, MapPin, 
  History, User, Settings, LogOut, Menu, X, Search, Trophy
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-2">
          <Heart size={18} className="text-red-500 fill-red-500" />
          <span className="font-black text-gray-800 tracking-tight">VitalDrop</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-gray-50 rounded-lg text-gray-600"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* SIDEBAR OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={closeMenu} />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:h-screen
      `}>
        {/* Desktop Logo */}
        <div className="p-6 mb-4 hidden lg:flex items-center gap-2">
          <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
            <Heart size={18} className="text-red-500 fill-red-500" />
          </div>
          <span className="text-xl font-black text-gray-800 tracking-tight">VitalDrop</span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 space-y-1 mt-20 lg:mt-0 overflow-y-auto">
          <SidebarItem to="/dashboard"   icon={<LayoutDashboard size={20}/>} label="Dashboard"   onClick={closeMenu} />
          <SidebarItem to="/emergency"   icon={<AlertCircle size={20}/>}     label="Emergency"   onClick={closeMenu} />
          <SidebarItem to="/donate"      icon={<Heart size={20}/>}           label="Donate"      onClick={closeMenu} />
          <SidebarItem to="/nearby"      icon={<MapPin size={20}/>}          label="Nearby"      onClick={closeMenu} />
          <SidebarItem to="/donors"      icon={<Search size={20}/>}          label="Find Donors" onClick={closeMenu} />
          <SidebarItem to="/leaderboard" icon={<Trophy size={20}/>}          label="Leaderboard" onClick={closeMenu} />
          <SidebarItem to="/activity"    icon={<History size={20}/>}         label="My Activity" onClick={closeMenu} />
          <SidebarItem to="/profile"     icon={<User size={20}/>}            label="Profile"     onClick={closeMenu} />
          <SidebarItem to="/settings"    icon={<Settings size={20}/>}        label="Settings"    onClick={closeMenu} />
        </nav>

        {/* Logout */}
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
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8 mt-16 lg:mt-0">
          {children}
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, to, onClick }) => (
  <NavLink 
    to={to} 
    onClick={onClick}
    className={({isActive}) => `
      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all 
      ${isActive ? 'bg-red-50 text-red-600 shadow-sm' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}
    `}
  >
    {icon} {label}
  </NavLink>
);

export default Layout;