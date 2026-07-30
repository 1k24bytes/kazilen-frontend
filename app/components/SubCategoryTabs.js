'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, LayoutGrid, Check } from 'lucide-react'

const subCategories = [
  { id: 'consult', label: 'Book Consultation', image: '/subcategories/consultation.webp', tag: 'Fast Booking' },
  { id: 'hourly', label: 'Book by Hour', image: '/subcategories/book-by-hour.webp', tag: 'Flexible' },
  { id: 'fan-install', label: 'Fan Installation', image: '/subcategories/fan-installation.webp' },
  { id: 'fan-repair', label: 'Fan Repair', image: '/subcategories/fan-repair.webp' },
  { id: 'light', label: 'Light Fitting', image: '/subcategories/light.webp' },
  { id: 'home-wiring', label: 'Home Wiring', image: '/subcategories/home-wiring.webp' },
  { id: 'switch-install', label: 'Switch Box Install', image: '/subcategories/switch-box-installation.webp' },
  { id: 'switch-repair', label: 'Switch Box Repair', image: '/subcategories/switch-box-repair.webp' },
  { id: 'switch-mcb', label: 'MCB & Fuse', image: '/subcategories/mcb.webp' },
  { id: 'inverter-install', label: 'Inverter Install', image: '/subcategories/inverter-installation.webp' },
  { id: 'inverter-maintainance', label: 'Inverter Service', image: '/subcategories/inverter-maintainance.webp' },
  { id: 'cooler-repair', label: 'Cooler Repair', image: '/subcategories/cooler-repair.webp' },
  { id: 'motor-rewinding', label: 'Motor Rewinding', image: '/subcategories/motor-rewinding.webp' },
]

export default function SubCategoryTabs({ value, onChange }) {
  const [showAll, setShowAll] = useState(false)
  const visibleCategories = subCategories.slice(0, 11)

  return (
    <>
      {/* Services Navigation Bar */}
      <div className="py-4 border-b border-slate-200/80 bg-slate-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold tracking-tight text-slate-800 uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff8a4c]" />
              Select Service Category
            </h2>
            <button
              onClick={() => setShowAll(true)}
              className="text-xs font-semibold text-[#ff8a4c] hover:text-[#f07432] flex items-center gap-1 cursor-pointer transition"
            >
              <LayoutGrid size={14} />
              <span>View All ({subCategories.length})</span>
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
            {visibleCategories.map((cat) => {
              const isActive = value === cat.id

              return (
                <button
                  key={cat.id}
                  onClick={() => onChange(cat.id)}
                  className={`shrink-0 w-28 sm:w-32 flex flex-col items-center gap-2 p-3 rounded-xl border transition cursor-pointer relative group ${
                    isActive
                      ? 'bg-[#fff4ed] border-[#ff8a4c] shadow-xs text-slate-900 ring-1 ring-[#ff8a4c]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#ff8a4c] text-white flex items-center justify-center">
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}

                  <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 group-hover:scale-105 transition-transform">
                    <Image src={cat.image} alt={cat.label} fill className="object-cover" />
                  </div>
                  
                  <span className={`text-xs font-semibold text-center leading-snug line-clamp-2 ${isActive ? 'text-[#ea580c]' : 'text-slate-700'}`}>
                    {cat.label}
                  </span>
                </button>
              )
            })}

            {/* View All Card Button */}
            <button
              onClick={() => setShowAll(true)}
              className="shrink-0 w-28 sm:w-32 flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-300 bg-white hover:bg-slate-50 hover:border-[#ff8a4c] text-slate-600 hover:text-[#ff8a4c] transition cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                <LayoutGrid size={20} />
              </div>
              <span className="text-xs font-semibold">More Services</span>
            </button>
          </div>
        </div>
      </div>

      {/* All Services Modal */}
      {showAll && (
        <div
          onClick={() => setShowAll(false)}
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">All Electrical Services</h3>
                <p className="text-xs text-slate-500 mt-0.5">Select a service category to find verified professionals in Nagpur</p>
              </div>
              <button
                onClick={() => setShowAll(false)}
                className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {subCategories.map((cat) => {
                const isActive = value === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setShowAll(false)
                      onChange(cat.id)
                    }}
                    className={`flex flex-col items-center gap-2.5 p-3.5 rounded-xl border text-center transition cursor-pointer ${
                      isActive
                        ? 'bg-[#fff4ed] text-slate-900 border-[#ff8a4c] ring-1 ring-[#ff8a4c] shadow-xs'
                        : 'bg-slate-50/70 hover:bg-slate-100/80 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-white shrink-0 shadow-2xs">
                      <Image src={cat.image} alt={cat.label} fill className="object-cover" />
                    </div>
                    <span className={`text-xs font-semibold leading-snug line-clamp-2 ${isActive ? 'text-[#ea580c]' : 'text-slate-800'}`}>
                      {cat.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
