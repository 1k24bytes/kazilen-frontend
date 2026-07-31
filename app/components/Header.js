'use client'

import { MapPin, ChevronDown, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Header() {
  const router = useRouter()
  const [token, setToken] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('access_token'))
    }
  }, [])

  const openAddress = () => {
    router.push('/select-address')
  }

  const openProfile = () => {
    if (token) {
      router.push('/profile')
    } else {
      router.push('/login')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Only Text Brand Name */}
        <button
          onClick={() => router.push('/')}
          className="text-xl font-extrabold tracking-tight text-slate-900 hover:text-[#ff8a4c] transition cursor-pointer text-left focus:outline-none"
        >
          Kazilen
        </button>

        {/* Center: Address Selector */}
        <button
          onClick={openAddress}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer shadow-2xs"
          aria-label="Select address location"
        >
          <MapPin size={15} className="text-[#ff8a4c] shrink-0" />
          <span className="truncate max-w-[130px] sm:max-w-[220px] text-slate-800">
            Nagpur, MH
          </span>
          <ChevronDown size={14} className="text-slate-400 shrink-0" />
        </button>

        {/* Right Side: Profile Icon */}
        <button
          onClick={openProfile}
          className="w-9 h-9 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center transition cursor-pointer shadow-2xs shrink-0"
          aria-label="Profile"
          title="Account Profile"
        >
          <User size={16} />
        </button>

      </div>
    </header>
  )
}
