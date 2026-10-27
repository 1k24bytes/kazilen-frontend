'use client'

import Image from 'next/image'
import { Check, Droplets, Hammer, Snowflake, Wrench, Zap } from 'lucide-react'
import { useState } from 'react'

const TRADE_ICONS = {
  Electrician: Zap,
  Plumber: Droplets,
  ACTechnician: Snowflake,
  Carpenter: Hammer,
}

function tilePrice(sub) {
  const typeRaw = sub.price_type || sub.default_price_type
  const fixedRaw = sub.fixed_price ?? sub.default_fixed_price
  const hourlyRaw = sub.price_per_hour ?? sub.default_price_per_hour
  const isFixed = typeRaw === 'fixed' || Boolean(fixedRaw)
  if (isFixed && fixedRaw) return `from ₹${fixedRaw}`
  if (!isFixed && hourlyRaw) return `₹${hourlyRaw}/hr`
  if (fixedRaw) return `from ₹${fixedRaw}`
  if (hourlyRaw) return `₹${hourlyRaw}/hr`
  return ''
}

export default function ServiceBrowser({
  categories,
  subCategories,
  counts,
  category,
  subCategory,
  onCategory,
  onService,
}) {
  const [failedImages, setFailedImages] = useState({})

  const markFailed = (id) => setFailedImages((prev) => (prev[id] ? prev : { ...prev, [id]: true }))

  const filtered = subCategories.filter((s) => {
    if (!category) return true
    const catId = s.categoryId || s.category_id
    if (catId === category) return true
    if (String(category).toLowerCase().includes(String(catId || '').toLowerCase())) return true
    return false
  })
  const list = filtered.length > 0 ? filtered : subCategories

  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <h2 className="text-base font-bold tracking-tight text-slate-900">What do you need help with?</h2>
          <p className="mt-0.5 text-xs text-slate-500">Pick a trade, then a service. Rates show before you book.</p>
        </div>
        <p className="hidden shrink-0 text-xs font-semibold tabular-nums text-slate-500 sm:block">
          {list.length} options
        </p>
      </div>

      <div className="grid lg:grid-cols-[200px_minmax(0,1fr)]">
        {/* Trades: compact chips on mobile, rows on desktop */}
        <div
          role="listbox"
          aria-label="Trades"
          className="flex gap-2 overflow-x-auto border-b border-slate-100 p-3 no-scrollbar lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r"
        >
          {categories.map((c) => {
            const isActive = category === c.id || category === c.name
            const Icon = TRADE_ICONS[c.id] || Wrench
            const showFallback = failedImages[c.id] || !c.image
            return (
              <button
                key={c.id || c.name}
                role="option"
                aria-selected={isActive}
                onClick={() => onCategory(c.id || c.name)}
                className={`flex shrink-0 cursor-pointer items-center gap-2.5 rounded-sm border px-2.5 py-2 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8a4c] lg:w-full ${
                  isActive
                    ? 'border-[#ff8a4c] bg-[#fff4ed] ring-1 ring-[#ff8a4c]'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-slate-100" aria-hidden="true">
                  {showFallback ? (
                    <Icon size={16} className={isActive ? 'text-[#ff8a4c]' : 'text-slate-500'} />
                  ) : (
                    <span className="relative block h-full w-full">
                      <Image
                        src={c.image}
                        alt=""
                        fill
                        sizes="32px"
                        loading="lazy"
                        className="object-cover"
                        onError={() => markFailed(c.id)}
                      />
                    </span>
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-bold leading-tight text-slate-900">
                    {c.name?.replace(' Services', '') || c.id}
                  </span>
                  <span className="block text-[11px] font-medium tabular-nums text-slate-500">
                    {counts[c.id] ? `${counts[c.id]} services` : 'Services'}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        {/* Services grid */}
        <div className="p-3">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-5" role="listbox" aria-label="Service options">
            {list.map((s) => {
              const isActive = subCategory === s.id
              const price = tilePrice(s)
              return (
                <button
                  key={s.id}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => onService(s.id)}
                  className={`group flex cursor-pointer flex-col overflow-hidden rounded-sm border text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8a4c] ${
                    isActive
                      ? 'border-[#ff8a4c] bg-[#fff4ed] ring-1 ring-[#ff8a4c]'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="relative block h-16 w-full overflow-hidden bg-slate-100 sm:h-[4.5rem]">
                    {failedImages[s.id] || !s.image ? (
                      <span className="flex h-full w-full items-center justify-center" aria-hidden="true">
                        <Wrench size={18} className="text-slate-400" />
                      </span>
                    ) : (
                      <Image
                        src={s.image}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 12vw"
                        loading="lazy"
                        className="object-cover"
                        onError={() => markFailed(s.id)}
                      />
                    )}
                    {isActive && (
                      <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-sm bg-[#ff8a4c] text-white" aria-hidden="true">
                        <Check size={10} strokeWidth={3} />
                      </span>
                    )}
                  </span>
                  <span className="flex min-h-[2.9rem] flex-col justify-center gap-px p-2">
                    <span className={`text-[11px] font-bold leading-tight line-clamp-2 ${isActive ? 'text-[#ea580c]' : 'text-slate-800'}`}>
                      {s.label}
                    </span>
                    {price && (
                      <span className="text-[10px] font-semibold tabular-nums text-slate-500">{price}</span>
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
