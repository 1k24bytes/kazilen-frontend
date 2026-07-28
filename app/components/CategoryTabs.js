'use client'

import Image from 'next/image'

const categories = [
  { name: 'Electrician', image: '/categories/Electrician-service.webp' },
]

export default function CategoryTabs({ value, onChange }) {
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-3">
      <div className="overflow-x-auto -mx-3 px-3">
        <div className="flex gap-5 py-3">
          {categories.map((category) => {
            const isActive = value === category.name

            return (
              <button
                key={category.name}
                onClick={() => onChange(category.name)}
                className={`flex flex-col items-center pb-1 transition-all duration-200
                  ${
                    isActive
                      ? 'border-b-4 border-pink-500 bg-pink-50 rounded-md'
                      : ''
                  }`}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  width={55}
                  height={55}
                  className="rounded-full"
                />

                <span
                  className={`text-xs mt-1 ${
                    isActive
                      ? 'text-pink-600 font-semibold'
                      : 'text-gray-500'
                  }`}
                >
                  {category.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
