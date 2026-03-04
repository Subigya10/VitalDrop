import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Droplets, ArrowRight, ArrowLeft, Heart } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Who each blood type can DONATE TO
const canDonateTo = {
  'A+':  ['A+', 'AB+'],
  'A-':  ['A+', 'A-', 'AB+', 'AB-'],
  'B+':  ['B+', 'AB+'],
  'B-':  ['B+', 'B-', 'AB+', 'AB-'],
  'AB+': ['AB+'],
  'AB-': ['AB+', 'AB-'],
  'O+':  ['A+', 'B+', 'O+', 'AB+'],
  'O-':  ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
};

// Who can DONATE TO each blood type
const canReceiveFrom = {
  'A+':  ['A+', 'A-', 'O+', 'O-'],
  'A-':  ['A-', 'O-'],
  'B+':  ['B+', 'B-', 'O+', 'O-'],
  'B-':  ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  'AB-': ['A-', 'B-', 'AB-', 'O-'],
  'O+':  ['O+', 'O-'],
  'O-':  ['O-'],
};

const funFacts = {
  'A+':  'A+ is the second most common blood type. About 1 in 3 people have it!',
  'A-':  'A- donors are valuable — their blood can go to A+, A-, AB+, and AB- patients.',
  'B+':  'B+ is more common in South Asian and East Asian populations.',
  'B-':  'Only about 2% of people have B- blood, making donors very rare and valuable.',
  'AB+': 'AB+ is the universal recipient — you can receive from literally anyone!',
  'AB-': 'AB- is one of the rarest blood types, found in less than 1% of people.',
  'O+':  'O+ is the most common blood type worldwide. Over 37% of people have it!',
  'O-':  'O- is the universal donor — your blood can save literally anyone in an emergency.',
};

const BloodCompatibility = () => {
  const [selected, setSelected] = useState(null);

  const donors    = selected ? canReceiveFrom[selected] : [];
  const receivers = selected ? canDonateTo[selected]    : [];

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-2 md:px-0 pb-12">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
            <Droplets size={22} className="text-red-500" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-800">Blood Compatibility</h1>
            <p className="text-sm text-gray-400">Select your blood group to see who you can save</p>
          </div>
        </div>

        {/* Blood Group Selector */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Select Blood Group</p>
          <div className="grid grid-cols-4 gap-3">
            {BLOOD_GROUPS.map(bg => (
              <button key={bg} onClick={() => setSelected(bg === selected ? null : bg)}
                className={`py-4 rounded-2xl text-lg font-black border-2 transition-all active:scale-95 ${
                  selected === bg
                    ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-200 scale-105'
                    : 'border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50'
                }`}>
                {bg}
              </button>
            ))}
          </div>
        </div>

        {!selected ? (
          /* Empty state */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Droplets size={28} className="text-red-300" />
            </div>
            <p className="text-gray-400 font-semibold">Pick a blood group above</p>
            <p className="text-gray-300 text-sm mt-1">to see compatibility details</p>
          </div>
        ) : (
          <>
            {/* Fun fact */}
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
              <span className="text-xl shrink-0">💡</span>
              <p className="text-sm text-red-700 font-medium">{funFacts[selected]}</p>
            </div>

            {/* Compatibility Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

              {/* Can Donate To */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                    <ArrowRight size={15} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-700 uppercase tracking-wide">Can Donate To</p>
                    <p className="text-[10px] text-gray-400">{selected} blood can go to</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {BLOOD_GROUPS.map(bg => (
                    <div key={bg}
                      className={`px-3 py-2 rounded-xl text-sm font-black border-2 transition-all ${
                        receivers.includes(bg)
                          ? 'bg-green-500 border-green-500 text-white shadow-sm'
                          : 'border-gray-100 text-gray-300 bg-gray-50'
                      }`}>
                      {bg}
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 mt-3">
                  Can donate to <span className="font-bold text-green-600">{receivers.length}</span> blood type{receivers.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Can Receive From */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                    <ArrowLeft size={15} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-700 uppercase tracking-wide">Can Receive From</p>
                    <p className="text-[10px] text-gray-400">{selected} can accept blood from</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {BLOOD_GROUPS.map(bg => (
                    <div key={bg}
                      className={`px-3 py-2 rounded-xl text-sm font-black border-2 transition-all ${
                        donors.includes(bg)
                          ? 'bg-blue-500 border-blue-500 text-white shadow-sm'
                          : 'border-gray-100 text-gray-300 bg-gray-50'
                      }`}>
                      {bg}
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 mt-3">
                  Can receive from <span className="font-bold text-blue-600">{donors.length}</span> blood type{donors.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Full compatibility matrix */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-black text-gray-700 uppercase tracking-wider mb-4">Full Compatibility Matrix</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th className="text-left text-gray-400 font-bold pb-3 pr-3">Donor →</th>
                      {BLOOD_GROUPS.map(bg => (
                        <th key={bg} className={`pb-3 px-1 font-black text-center ${bg === selected ? 'text-red-500' : 'text-gray-400'}`}>
                          {bg}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {BLOOD_GROUPS.map(recipient => (
                      <tr key={recipient} className={recipient === selected ? 'bg-red-50 rounded-xl' : ''}>
                        <td className={`py-2 pr-3 font-black ${recipient === selected ? 'text-red-500' : 'text-gray-500'}`}>
                          {recipient}
                        </td>
                        {BLOOD_GROUPS.map(donor => {
                          const compatible = canReceiveFrom[recipient].includes(donor);
                          const isHighlighted = recipient === selected || donor === selected;
                          return (
                            <td key={donor} className="py-2 px-1 text-center">
                              {compatible ? (
                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black ${
                                  isHighlighted ? 'bg-red-500 text-white' : 'bg-green-100 text-green-600'
                                }`}>✓</span>
                              ) : (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-50 text-gray-200 text-[10px]">✗</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-gray-300 mt-3">Rows = recipient · Columns = donor · ✓ = compatible</p>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default BloodCompatibility;