// components/AuthPanel.jsx
// Reusable dark red side panel for Login and Signup pages

import { Heart, Droplets, Users, Shield } from "lucide-react";

const quotes = [
  { text: "Every drop counts. Your donation can save up to 3 lives.", author: "Nepal Red Cross" },
  { text: "Blood is the most precious gift you can give to another human being.", author: "WHO" },
  { text: "Donating blood is one of the greatest gifts you can give.", author: "VitalDrop" },
];

// Pick a random quote each render
const quote = quotes[Math.floor(Math.random() * quotes.length)];

const AuthPanel = () => {
  return (
    <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-red-700 via-red-600 to-rose-500 flex-col justify-between p-10 relative overflow-hidden">

      {/* Background decorative circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />

      {/* Top — Branding */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
            <Heart size={18} className="text-white fill-white" />
          </div>
          <span className="text-white font-black text-xl tracking-tight">VitalDrop</span>
        </div>

        <h2 className="text-white font-black text-2xl leading-snug mb-3">
          Save lives.<br />One drop<br />at a time.
        </h2>
        <p className="text-red-100 text-sm leading-relaxed">
          Nepal's platform connecting blood donors with those in urgent need.
        </p>
      </div>

      {/* Middle — Stats */}
      <div className="relative z-10 space-y-3">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Droplets size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-black text-lg leading-none">75,000+</p>
            <p className="text-red-100 text-xs mt-0.5">Blood Donations Facilitated</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Users size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-black text-lg leading-none">5,200+</p>
            <p className="text-red-100 text-xs mt-0.5">Active Donors Across Nepal</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-black text-lg leading-none">1,500+</p>
            <p className="text-red-100 text-xs mt-0.5">Lives Saved This Year</p>
          </div>
        </div>
      </div>

      {/* Bottom — Quote */}
      <div className="relative z-10">
        <div className="border-t border-white/20 pt-6">
          <p className="text-white/90 text-sm italic leading-relaxed mb-2">
            "{quote.text}"
          </p>
          <p className="text-red-200 text-xs font-bold">— {quote.author}</p>
        </div>
      </div>

    </div>
  );
};

export default AuthPanel;