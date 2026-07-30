'use client'

import { MapPin, ChevronDown, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()

  const openAddress = () => {
    router.push('/select-address')
  }

  const openProfile = () => {
    router.push('/profile')
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-200/80 px-4 py-3">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
        {/* Address Selector Button */}
        <button
          onClick={openAddress}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-zinc-200/80 bg-zinc-50/50 hover:bg-zinc-100 text-zinc-800 text-xs font-medium transition cursor-pointer"
          aria-label="Select address"
        >
          <MapPin size={14} className="text-zinc-600 shrink-0" />
          <span className="truncate max-w-[130px] sm:max-w-[200px]">Address</span>
          <ChevronDown size={12} className="text-zinc-400 shrink-0" />
        </button>

        {/* Center Badge */}
        <div className="flex items-center">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-medium text-zinc-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Nagpur
          </span>
        </div>

        {/* Profile Button */}
        <button
          onClick={openProfile}
          className="w-8 h-8 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full flex items-center justify-center font-medium text-xs shadow-xs transition cursor-pointer"
          title="Open profile"
          aria-label="Open profile"
        >
          <User size={14} />
        </button>
      </div>
    </header>
  )
}
