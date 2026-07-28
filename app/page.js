"use client";

import { useState } from "react";
import { Zap, Droplets, Wrench, Sparkles, Fan, Lightbulb, PlugZap, Settings, Star, ChevronRight } from "lucide-react";

const CATEGORIES = [
  { id: "electrician", label: "Electrician", icon: Zap },
  { id: "plumber", label: "Plumber", icon: Droplets },
  { id: "carpenter", label: "Carpenter", icon: Wrench },
  { id: "cleaner", label: "Cleaning", icon: Sparkles },
];

const SUB_CATEGORIES = {
  electrician: [
    { id: "fan", label: "Fan Repair", icon: Fan },
    { id: "light", label: "Lighting", icon: Lightbulb },
    { id: "wiring", label: "Home Wiring", icon: PlugZap },
    { id: "mcb", label: "MCB & Switches", icon: Settings },
  ]
};

const DUMMY_WORKERS = [
  { id: 1, name: "Rahul Sharma", rating: "4.8", address: "Koramangala, 5km away", price: 150, jobs: 124 },
  { id: 2, name: "Prakash Kumar", rating: "4.6", address: "Indiranagar, 2km away", price: 120, jobs: 89 },
];

export default function CustomerHomePage() {
  const [category, setCategory] = useState("electrician");
  const [subCategory, setSubCategory] = useState("fan");

  const currentSubCategories = SUB_CATEGORIES[category] || [];

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white pt-12 pb-4 px-4 shadow-sm sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-gray-900">Kazilen Services</h1>
        <p className="text-sm text-gray-500 mt-1">Professional help at your doorstep</p>
      </header>

      {/* Main Categories */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = category === cat.id;
            const Icon = cat.icon;
            
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setCategory(cat.id);
                  setSubCategory(SUB_CATEGORIES[cat.id]?.[0]?.id || "");
                }}
                className={`flex flex-col items-center gap-2 min-w-[70px] transition-all`}
              >
                <div className={`p-4 rounded-full ${isActive ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-500'}`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-xs font-semibold ${isActive ? 'text-pink-600' : 'text-gray-500'}`}>
                  {cat.label}
                </span>
                {isActive && <div className="w-10 h-1 bg-pink-500 rounded-t-md mt-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub Categories */}
      {currentSubCategories.length > 0 && (
        <div className="px-4 mt-6">
          <div className="grid grid-cols-4 gap-3">
            {currentSubCategories.map((sub) => {
              const isActive = subCategory === sub.id;
              const Icon = sub.icon;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSubCategory(sub.id)}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all ${
                    isActive 
                      ? "bg-pink-50 border-pink-200 text-pink-700 shadow-sm" 
                      : "bg-white border-gray-100 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={20} className={isActive ? "text-pink-500" : "text-gray-400"} />
                  <span className="text-[10px] font-semibold text-center leading-tight">
                    {sub.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Professionals List */}
      <div className="px-4 mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
          Recommended Professionals
        </h2>
        
        <div className="space-y-4">
          {DUMMY_WORKERS.map((worker) => (
            <div key={worker.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{worker.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{worker.address}</p>
                </div>
                <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                  <Star size={14} className="text-green-600 fill-green-600" />
                  <span className="text-sm font-bold text-green-700">{worker.rating}</span>
                </div>
              </div>

              <div className="mt-4 flex items-end justify-between border-t border-gray-50 pt-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Starting from</p>
                  <p className="text-lg font-black text-pink-600">₹{worker.price} <span className="text-sm font-medium text-gray-500 line-through ml-1">₹{worker.price + 50}</span></p>
                </div>
                
                <button className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-xl font-semibold text-sm transition-colors shadow-sm flex items-center gap-1">
                  Book Now
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
