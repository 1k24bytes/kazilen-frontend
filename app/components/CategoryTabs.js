'use client'

import Image from 'next/image'

const categories = [
  { name: 'Electrician', image: '/categories/Electrician-service.webp' },
]

export default function CategoryTabs({ value, onChange }) {
  return (
    <div className="bg-white border-b border-zinc-200/80 px-4 py-3">
      <div className="max-w-xl mx-auto flex gap-2 overflow-x-auto no-scrollbar">
        {categories.map((category) => {
          const isActive = value === category.name

          return (
            <button
              key={category.name}
              onClick={() => onChange(category.name)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-medium transition cursor-pointer border ${
                isActive
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                  : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200/80'
              }`}
            >
              <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 bg-zinc-200">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span>{category.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
