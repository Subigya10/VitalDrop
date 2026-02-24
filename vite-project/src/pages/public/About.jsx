import React from 'react';
import { Heart, Users, Droplets, Shield } from 'lucide-react';
import Navbar from '../../components/Navbar';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-3xl mx-auto pt-28 pb-20 px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={32} className="text-red-500 fill-red-200" />
          </div>
          <h1 className="text-3xl font-black text-gray-800 mb-2">About VitalDrop</h1>
          <p className="text-gray-400">Connecting blood donors with those in need</p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6 shadow-sm">
          <h2 className="text-xl font-black text-gray-800 mb-3">Our Mission</h2>
          <p className="text-gray-500 leading-relaxed">
            VitalDrop is a platform dedicated to saving lives by connecting people who need blood with voluntary donors in their area. 
            We believe that no one should lose their life due to lack of blood — and with your help, they won't.
          </p>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6 shadow-sm">
          <h2 className="text-xl font-black text-gray-800 mb-6">How It Works</h2>
          <div className="space-y-6">
            <Step number="1" title="Post a Request" description="If you or someone you know needs blood urgently, post a blood request with patient details and location." />
            <Step number="2" title="Donors Respond" description="Nearby donors who match the blood group see your request and can respond to help." />
            <Step number="3" title="Save a Life" description="The donor contacts you and donates blood. Together you save a life!" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard icon={<Droplets size={24} className="text-red-500"/>} value="100+" label="Lives Saved" />
          <StatCard icon={<Users size={24} className="text-blue-500"/>} value="500+" label="Donors" />
          <StatCard icon={<Shield size={24} className="text-green-500"/>} value="24/7" label="Available" />
        </div>

        {/* Values */}
        <div className="bg-red-50 rounded-2xl border border-red-100 p-8 shadow-sm">
          <h2 className="text-xl font-black text-gray-800 mb-3">Our Values</h2>
          <div className="space-y-2">
            <Value text="❤️ Compassion — We care deeply about every life." />
            <Value text="⚡ Speed — Every second counts in an emergency." />
            <Value text="🤝 Community — Together we are stronger." />
            <Value text="🔒 Trust — Your data is safe with us." />
          </div>
        </div>

      </div>
    </div>
  );
};

const Step = ({ number, title, description }) => (
  <div className="flex gap-4">
    <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-black text-sm shrink-0">
      {number}
    </div>
    <div>
      <h3 className="font-bold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-400 mt-0.5">{description}</p>
    </div>
  </div>
);

const StatCard = ({ icon, value, label }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm">
    <div className="flex justify-center mb-2">{icon}</div>
    <p className="text-2xl font-black text-gray-800">{value}</p>
    <p className="text-xs text-gray-400 font-medium">{label}</p>
  </div>
);

const Value = ({ text }) => (
  <p className="text-sm text-gray-600 py-1">{text}</p>
);

export default About;