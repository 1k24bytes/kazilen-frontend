'use client'

import { MapPin, ChevronDown, User, Search, ShieldCheck, PhoneCall, HelpCircle } from 'lucide-react'
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-6">
        
        {/* Brand & Location */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff8a4c] to-[#ffa473] flex items-center justify-center text-white font-extrabold text-lg shadow-sm shadow-orange-500/20 group-hover:scale-105 transition-transform">
              K
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-[#ff8a4c] transition-colors">
                Kazilen
              </span>
              <span className="hidden sm:inline-block ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-[#fff4ed] text-[#ea580c] rounded border border-[#ffd5be]">
                Verified
              </span>
            </div>
          </button>

          {/* Divider */}
          <div className="hidden sm:block h-6 w-px bg-slate-200" />

          {/* Address / Location Selector */}
          <button
            onClick={openAddress}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-700 text-xs font-medium transition cursor-pointer"
            aria-label="Select address location"
          >
            <MapPin size={15} className="text-[#ff8a4c] shrink-0" />
            <div className="text-left leading-tight">
              <span className="block text-[10px] text-slate-400 font-normal uppercase">Location</span>
              <span className="font-semibold text-slate-800 truncate max-w-[110px] sm:max-w-[160px] inline-block align-bottom">
                Nagpur, MH
              </span>
            </div>
            <ChevronDown size={14} className="text-slate-400 shrink-0 ml-0.5" />
          </button>
        </div>

        {/* Center Search Bar (Desktop) */}
        <div className="hidden lg:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search for electrician, fan repair, light fitting..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#ff8a4c] focus:ring-2 focus:ring-[#ff8a4c]/20 transition"
            />
          </div>
        </div>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex items-center gap-5 text-xs font-medium text-slate-600">
            <button 
              onClick={() => router.push('/')}
              className="hover:text-[#ff8a4c] transition cursor-pointer"
            >
              Services
            </button>
            <button 
              onClick={() => router.push('/profile')}
              className="hover:text-[#ff8a4c] transition cursor-pointer"
            >
              My Bookings
            </button>
            <a 
              href="tel:1800000000" 
              className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition"
            >
              <PhoneCall size={14} className="text-[#ff8a4c]" />
              <span>Help Center</span>
            </a>
          </div>

          {/* Profile / Account CTA */}
          <button
            onClick={openProfile}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#ff8a4c] hover:bg-[#f07432] text-white rounded-lg font-medium text-xs shadow-sm shadow-orange-500/20 transition cursor-pointer active:scale-95"
            aria-label="Account"
          >
            <User size={15} />
            <span className="hidden sm:inline-block font-semibold">
              {token ? "Account" : "Sign In"}
            </span>
          </button>
        </div>

      </div>
    </header>
  )
}
