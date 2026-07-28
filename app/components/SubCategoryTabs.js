'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

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
      {/* Horizontal Tabs */}
      <div className="px-4 mt-4">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {visibleCategories.map((cat) => {
            const isActive = value === cat.id

            return (
              <button
                key={cat.id}
                onClick={() => onChange(cat.id)}
                className={`min-w-[84px] max-w-[84px] flex flex-col items-center gap-1.5 px-2 py-3 rounded-2xl transition
                  ${
                    isActive
                      ? 'bg-pink-50 ring-1 ring-pink-500/40'
                      : 'bg-white hover:bg-gray-50'
                  } shadow-sm`}
              >
                <Image src={cat.image} alt={cat.label} width={38} height={38} />
                <span className="text-[11px] font-medium text-gray-700 text-center leading-tight">
                  {cat.label}
                </span>
              </button>
            )
          })}

          {/* More */}
          <button
            onClick={() => setShowAll(true)}
            className="min-w-[84px] max-w-[84px] flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-2xl bg-gray-50 border border-dashed border-gray-300"
          >
            <span className="text-lg font-semibold">+</span>
            <span className="text-[11px] font-medium text-gray-600">More</span>
          </button>
        </div>
      </div>

      {/* All Categories Modal */}
      {showAll && (
        <Overlay onClose={() => setShowAll(false)}>
          <Modal title="All Services" onClose={() => setShowAll(false)}>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(72px,1fr))] gap-4">
              {subCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setShowAll(false)
                    onChange(cat.id)
                  }}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-gray-50 hover:bg-pink-50 transition"
                >
                  <Image src={cat.image} alt={cat.label} width={42} height={42} />
                  <span className="text-[12px] text-center font-medium text-gray-700">
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </Modal>
        </Overlay>
      )}
    </>
  )
}

/* ---------- UI helpers ---------- */

function Overlay({ children, onClose }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center"
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full">
        {children}
      </div>
    </div>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="bg-white w-full sm:max-w-md mx-auto rounded-t-3xl sm:rounded-3xl p-5 max-h-[85vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button onClick={onClose}>
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      {children}
    </div>
  )
}
