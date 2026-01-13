import React from "react";
import Navbar from "../../components/Navbar";
import dactor from "../../assets/dactor.png";

import { Heart, Users, Activity, Shield, MapPin, Clock, Award } from "lucide-react";

function Welcomepage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b bg-red-50 pt-20 md:pt-16 pb-16 md:pb-24 flex flex-col md:flex-row items-center overflow-hidden">
        {/* Background Circles */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-red-300 rounded-full opacity-30"></div>
        <div className="absolute bottom-10 right-20 w-32 h-32 bg-pink-400 rounded-full opacity-20"></div>
        <div className="absolute bottom-32 left-32 w-24 h-24 bg-pink-300 rounded-full opacity-15"></div>

        {/* Hero Text */}
        <div className="md:w-2/3 px-4 md:px-8 lg:px-16 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-black mb-4 leading-tight">
            Your blood can be someone's <span className="text-red-600">life</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-black mb-6 md:mb-8">
            Helping Nepal in Emergencies
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start">
            <button className="bg-red-600 text-white px-6 py-3 rounded-full font-bold hover:bg-white hover:text-black transition">
              Donate Blood
            </button>
            <button className="bg-red-600 text-white border-2 border-red-600 px-8 py-3 rounded-full font-bold hover:bg-white hover:text-black transition">
              Learn More
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="md:w-1/3 mt-8 md:mt-0 flex justify-center md:justify-end px-4">
          <img
            src={dactor}
            alt="Doctor"
            className="h-64 sm:h-80 md:h-96 w-auto object-contain border-2 border-red-600 rounded-xl shadow-lg "
          />
        </div>
      </section>

      {/* Our Mission */}
      <div className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-red-600 mb-3 md:mb-4">
            Our Mission
          </h2>
          <p className="text-center text-gray-600 text-base md:text-lg max-w-2xl mx-auto mb-8 md:mb-12 px-4">
            We help our patients live a healthy, longer life by improving access to blood donations
          </p>
          
         
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-red-50 p-6 md:p-8 rounded-lg text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="text-red-600" size={32} />
              </div>
              <h3 className="font-bold text-base md:text-lg mb-2">Blood Donation Awareness</h3>
              <p className="text-gray-600 text-sm">
                Educating communities about the importance of regular blood donation
              </p>
            </div>
            
            <div className="bg-red-50 p-6 md:p-8 rounded-lg text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-red-600" size={32} />
              </div>
              <h3 className="font-bold text-base md:text-lg mb-2">Community Education</h3>
              <p className="text-gray-600 text-sm">
                Building a strong network of donors and volunteers across Nepal
              </p>
            </div>
            
            <div className="bg-red-50 p-6 md:p-8 rounded-lg text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-red-600" size={32} />
              </div>
              <h3 className="font-bold text-base md:text-lg mb-2">Emergency Support</h3>
              <p className="text-gray-600 text-sm">
                Providing rapid response to urgent blood requirements 24/7
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-gray-50 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 md:mb-12 px-4">Our Impact</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 px-4 md:px-6">
          <div>
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-red-600">75,450+</p>
            <p className="text-gray-600 mt-2 text-sm md:text-base">Blood Donations</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-red-600">5,200+</p>
            <p className="text-gray-600 mt-2 text-sm md:text-base">Active Donors</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-red-600">1,500+</p>
            <p className="text-gray-600 mt-2 text-sm md:text-base">Lives Saved</p>
          </div>
        </div>
      </section>

      {/* Stories of Hope */}
      <section className="py-12 md:py-16 bg-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 md:mb-12 px-4">Stories of Hope</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 px-4 md:px-6">
          <div className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart size={24} className="text-red-600" fill="currentColor" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-base md:text-lg">Saved by a Stranger</h3>
                <p className="text-xs md:text-sm text-gray-500">Donor Story - 2 months ago</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm text-left">
              "I received blood during an emergency surgery. Thanks to anonymous donors, I'm here today with my family."
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Award size={24} className="text-red-600" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-base md:text-lg">100 Times Donor</h3>
                <p className="text-xs md:text-sm text-gray-500">Achievement - 1 month ago</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm text-left">
              "I've donated blood 100 times. It's the simplest way to save lives and give back to the community."
            </p>
          </div>
        </div>
      </section>

      {/* Find a Session */}
      <section className="py-12 md:py-16 bg-red-50 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4 px-4">Find a Session</h2>
        <p className="text-gray-600 mb-6 md:mb-8 px-4 text-sm md:text-base">
          Locate nearby blood donation camps and schedule your visit
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 px-4 md:px-6 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4 hover:shadow-lg transition">
            <MapPin className="text-red-600 flex-shrink-0" size={32} />
            <div className="text-left">
              <h3 className="font-bold text-sm md:text-base">Safety & Assurance</h3>
              <p className="text-xs md:text-sm text-gray-600">All equipment is sterile & disposable</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4 hover:shadow-lg transition">
            <Activity className="text-red-600 flex-shrink-0" size={32} />
            <div className="text-left">
              <h3 className="font-bold text-sm md:text-base">Health Benefits</h3>
              <p className="text-xs md:text-sm text-gray-600">Reduces risk of heart disease</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4 hover:shadow-lg transition">
            <Clock className="text-red-600 flex-shrink-0" size={32} />
            <div className="text-left">
              <h3 className="font-bold text-sm md:text-base">Quick Process</h3>
              <p className="text-xs md:text-sm text-gray-600">Takes only 10-15 minutes</p>
            </div>
          </div>
        </div>
        <button className="mt-6 md:mt-8 bg-red-600 text-white px-6 md:px-8 py-3 rounded-md hover:bg-red-700 font-medium text-sm md:text-base">
          Find Nearest Location
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart size={24} fill="currentColor" />
                <span className="text-lg md:text-xl font-bold">VitalDrop</span>
              </div>
              <p className="text-gray-400 text-sm">
                Saving lives through blood donation across Nepal
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer">About Us</li>
                <li className="hover:text-white cursor-pointer">Find Blood</li>
                <li className="hover:text-white cursor-pointer">Donate</li>
                <li className="hover:text-white cursor-pointer">Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer">Eligibility</li>
                <li className="hover:text-white cursor-pointer">FAQs</li>
                <li className="hover:text-white cursor-pointer">Blood Types</li>
                <li className="hover:text-white cursor-pointer">Health Tips</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base">Contact Us</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">+977-1-234567</li>
                <li className="flex items-center gap-2">info@vitaldrop.org</li>
                <li className="flex items-center gap-2">Kathmandu, Nepal</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 md:pt-8 text-center text-xs md:text-sm text-gray-400">
            &copy; 2026 VitalDrop. All rights reserved. Saving lives one donation at a time.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Welcomepage;