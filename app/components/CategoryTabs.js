'use client'

import Image from 'next/image'
import servicesData from '../data/services.json'

const categories = servicesData.categories || []

export default function CategoryTabs({ value, onChange }) {
  return (
    <div className="bg-white border-b border-slate-200/80 py-4 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          {categories.map((category) => {
            const isActive = value === category.name

            return (
              <button
                key={category.name}
                onClick={() => onChange(category.name)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-xs font-semibold transition cursor-pointer border ${
                  isActive
                    ? 'bg-[#ff8a4c] text-white border-[#ff8a4c] shadow-sm shadow-orange-500/20'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <div className={`relative w-7 h-7 rounded-sm overflow-hidden shrink-0 flex items-center justify-center ${isActive ? 'bg-white/20' : 'bg-slate-200/80'}`}>
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-left">
                  <span className="block leading-tight">{category.name}</span>
                  <span className={`text-[10px] font-normal ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                    {category.desc}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
