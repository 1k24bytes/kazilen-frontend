'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, LayoutGrid } from 'lucide-react'

const subCategories = [
  { id: 'consult', label: 'Book Consultation', image: '/subcategories/consultation.webp' },
  { id: 'hourly', label: 'Book by Hour', image: '/subcategories/book-by-hour.webp' },
  { id: 'fan-install', label: 'Fan Installation', image: '/subcategories/fan-installation.webp' },
  { id: 'fan-repair', label: 'Fan Repair', image: '/subcategories/fan-repair.webp' },
  { id: 'light', label: 'Light', image: '/subcategories/light.webp' },
  { id: 'home-wiring', label: 'Home Wiring', image: '/subcategories/home-wiring.webp' },
  { id: 'switch-install', label: 'Switch Box Installation', image: '/subcategories/switch-box-installation.webp' },
  { id: 'switch-repair', label: 'Switch Box Repair', image: '/subcategories/switch-box-repair.webp' },
  { id: 'switch-mcb', label: 'MCB', image: '/subcategories/mcb.webp' },
  { id: 'inverter-install', label: 'Inverter Installation', image: '/subcategories/inverter-installation.webp' },
  { id: 'inverter-maintainance', label: 'Inverter Maintainance', image: '/subcategories/inverter-maintainance.webp' },
  { id: 'cooler-repair', label: 'Cooler Repair', image: '/subcategories/cooler-repair.webp' },
  { id: 'motor-rewinding', label: 'Motor Rewinding', image: '/subcategories/motor-rewinding.webp' },
]

export default function SubCategoryTabs({ value, onChange }) {
  const [showAll, setShowAll] = useState(false)
  const visibleCategories = subCategories.slice(0, 11)

  return (
    <>
      {/* Horizontal Scroll Tabs */}
      <div className="py-4 border-b border-zinc-200/60 bg-zinc-50/50">
        <div className="max-w-xl mx-auto px-4 flex gap-2.5 overflow-x-auto no-scrollbar py-0.5">
          {visibleCategories.map((cat) => {
            const isActive = value === cat.id

            return (
              <button
                key={cat.id}
                onClick={() => onChange(cat.id)}
                className={`shrink-0 w-[90px] flex flex-col items-center gap-2 p-2.5 rounded-lg border transition cursor-pointer ${
                  isActive
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                    : 'bg-white text-zinc-700 border-zinc-200/80 hover:bg-zinc-100/80 hover:border-zinc-300'
                }`}
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-zinc-100 shrink-0">
                  <Image src={cat.image} alt={cat.label} fill className="object-cover" />
                </div>
                <span className={`text-[11px] font-medium text-center leading-tight line-clamp-2 ${isActive ? 'text-white' : 'text-zinc-700'}`}>
                  {cat.label}
                </span>
              </button>
            )
          })}

          {/* More Button */}
          <button
            onClick={() => setShowAll(true)}
            className="shrink-0 w-[90px] flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-lg border border-dashed border-zinc-300 bg-white hover:bg-zinc-100/80 text-zinc-600 transition cursor-pointer"
          >
            <LayoutGrid size={18} className="text-zinc-500" />
            <span className="text-[11px] font-medium">More</span>
          </button>
        </div>
      </div>

      {/* All Services Modal */}
      {showAll && (
        <div
          onClick={() => setShowAll(false)}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md bg-white rounded-t-xl sm:rounded-lg border border-zinc-200 p-5 shadow-xl max-h-[85vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
              <div>
                <h3 className="text-base font-semibold text-zinc-900">All Electrical Services</h3>
                <p className="text-xs text-zinc-500">Select a sub-category to filter professionals</p>
              </div>
              <button
                onClick={() => setShowAll(false)}
                className="w-8 h-8 rounded-md hover:bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {subCategories.map((cat) => {
                const isActive = value === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setShowAll(false)
                      onChange(cat.id)
                    }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border text-center transition cursor-pointer ${
                      isActive
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                        : 'bg-zinc-50/50 hover:bg-zinc-100 text-zinc-700 border-zinc-200/80'
                    }`}
                  >
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-zinc-100 shrink-0">
                      <Image src={cat.image} alt={cat.label} fill className="object-cover" />
                    </div>
                    <span className={`text-[11px] font-medium leading-snug line-clamp-2 ${isActive ? 'text-white' : 'text-zinc-800'}`}>
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
