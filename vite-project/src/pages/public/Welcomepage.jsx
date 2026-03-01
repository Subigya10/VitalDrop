import { Heart, Users, Activity, Shield, Award, ArrowRight, Droplets, Mail, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import dactor from "../../assets/dactor.png";

function Welcomepage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] bg-[#fff5f5] flex flex-col md:flex-row items-center overflow-hidden px-6 md:px-16 lg:px-24 pt-20 pb-12">

        {/* decorative blobs */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-red-200 rounded-full opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-pink-300 rounded-full opacity-15 blur-2xl pointer-events-none" />

        {/* text */}
        <div className="relative z-10 flex-1 text-center md:text-left max-w-2xl">

          {/* pill badge */}
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            <Droplets size={12} className="fill-red-500" /> Nepal's Blood Donation Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-4">
            Your blood can be<br />
            someone's <span className="text-red-500 relative">
              life
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 100 8" preserveAspectRatio="none">
                <path d="M0,6 Q50,0 100,6" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>

          <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto md:mx-0">
            Connect with donors, respond to emergencies, and save lives across Nepal — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <button
              onClick={() => navigate('/login')}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-200 transition active:scale-95">
              Donate Blood <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-white border-2 border-gray-200 hover:border-red-300 text-gray-700 px-8 py-3.5 rounded-2xl font-bold transition active:scale-95">
              Request Blood
            </button>
          </div>
        </div>

        {/* image */}
        <div className="relative z-10 flex-1 flex justify-center mt-10 md:mt-0">
          <div className="relative">
            <div className="absolute inset-0 bg-red-200 rounded-3xl rotate-3 opacity-40" />
            <img
              src={dactor}
              alt="Doctor"
              className="relative h-72 sm:h-80 md:h-96 w-auto object-contain rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-black text-center text-gray-900 mb-2">How It Works</h2>
          <p className="text-center text-gray-400 text-sm mb-12">Three simple steps to save a life</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", icon: <Users size={28} className="text-red-500" />, title: "Sign Up", desc: "Create your free account and fill in your blood group and details." },
              { step: "02", icon: <Activity size={28} className="text-red-500" />, title: "Find a Request", desc: "Browse urgent blood requests near you or respond to emergencies." },
              { step: "03", icon: <Heart size={28} className="text-red-500 fill-red-100" />, title: "Donate & Save", desc: "Head to the hospital and donate. Track your impact over time." },
            ].map((item) => (
              <div key={item.step} className="relative bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <span className="absolute top-4 right-4 text-5xl font-black text-gray-100">{item.step}</span>
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-black text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR MISSION ── just info cards, not buttons ── */}
      <section className="py-16 md:py-20 bg-[#fff5f5]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-black text-center text-gray-900 mb-2">Our Mission</h2>
          <p className="text-center text-gray-400 text-sm mb-12 max-w-lg mx-auto">
            Improving access to blood donations and emergency assistance across Nepal
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Activity size={24} className="text-red-500" />, title: "Donation Awareness", desc: "Educating communities about the importance of regular blood donation." },
              { icon: <Users size={24} className="text-red-500" />, title: "Community Network", desc: "Building a strong network of donors and volunteers across Nepal." },
              { icon: <Shield size={24} className="text-red-500" />, title: "Emergency Support", desc: "Rapid response to urgent blood requirements 24/7." },
            ].map((item) => (
              // These are INFO cards only — not clickable buttons
              <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm border border-red-50">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-black text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORIES ── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-black text-center text-gray-900 mb-2">Stories of Hope</h2>
          <p className="text-center text-gray-400 text-sm mb-12">Real people, real impact</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Heart size={18} className="text-red-500 fill-red-200" />
                </div>
                <div>
                  <p className="font-black text-gray-800 text-sm">Saved by a Stranger</p>
                  <p className="text-[10px] text-gray-400">2 months ago</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed italic">
                "I received blood during an emergency surgery. Thanks to anonymous donors, I'm here today with my family."
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Award size={18} className="text-red-500" />
                </div>
                <div>
                  <p className="font-black text-gray-800 text-sm">100 Times Donor</p>
                  <p className="text-[10px] text-gray-400">1 month ago</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed italic">
                "I've donated blood 100 times. It's the simplest way to save lives and give back to the community."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-16 bg-red-500 text-white text-center px-6">
        <h2 className="text-2xl md:text-3xl font-black mb-3">Ready to save a life today?</h2>
        <p className="text-red-100 mb-8 text-sm max-w-md mx-auto">
          Join donors across Nepal. It only takes 15 minutes.
        </p>
        <button
          onClick={() => navigate('/signup')}
          className="bg-white text-red-600 px-8 py-3.5 rounded-2xl font-black hover:bg-red-50 transition shadow-lg active:scale-95 inline-flex items-center gap-2">
          Get Started Free <ArrowRight size={16} />
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-5xl mx-auto">

          {/* top row */}
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">

            {/* brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <Heart size={16} className="fill-white text-white" />
                </div>
                <span className="font-black text-lg">VitalDrop</span>
              </div>
              <p className="text-gray-400 text-xs max-w-xs leading-relaxed">
                Nepal's platform for blood donation and emergency assistance. Saving lives one donation at a time.
              </p>
            </div>

            {/* quick links — these actually navigate */}
            <div>
              <h4 className="font-black text-sm mb-3 text-gray-200">Quick Links</h4>
              <div className="space-y-2">
                <p onClick={() => navigate('/signup')} className="text-gray-400 text-xs hover:text-white cursor-pointer transition">Sign Up</p>
                <p onClick={() => navigate('/login')} className="text-gray-400 text-xs hover:text-white cursor-pointer transition">Login</p>
                <p onClick={() => navigate('/login')} className="text-gray-400 text-xs hover:text-white cursor-pointer transition">Donate Blood</p>
                <p onClick={() => navigate('/login')} className="text-gray-400 text-xs hover:text-white cursor-pointer transition">Emergency Requests</p>
              </div>
            </div>

            {/* contact info — real info, not buttons */}
            <div>
              <h4 className="font-black text-sm mb-3 text-gray-200">Contact Us</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <Phone size={12} /> +977-9813020607
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <Mail size={12} /> info@vitaldrop.org
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <MapPin size={12} /> Kathmandu, Nepal
                </div>
              </div>
            </div>
          </div>

          {/* bottom row */}
          <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
            © 2026 VitalDrop. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Welcomepage;