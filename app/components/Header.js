'use client'

import { MapPin, ChevronDown, User, LocateFixed, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import LocationModal from './LocationModal'

import { API_BASE_URL, apiFetch } from '@/lib/api'

export default function Header() {
  const router = useRouter()
  const [currentArea, setCurrentArea] = useState('Nagpur, MH')
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const [showLocationBanner, setShowLocationBanner] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedArea = localStorage.getItem('user_location_area')
      if (savedArea) {
        setCurrentArea(savedArea)
      } else {
        apiFetch(`${API_BASE_URL}/addresses`, {
          headers: { }
        })
          .then((res) => (res.ok ? res.json() : []))
          .then((data) => {
            if (Array.isArray(data) && data.length > 0) {
              const def = data.find((a) => a.is_default) || data[0]
              const shortArea = def.area ? `${def.area}, ${def.city || 'Nagpur'}` : (def.city || 'Nagpur')
              setCurrentArea(shortArea)
              localStorage.setItem('user_location_area', shortArea)
              localStorage.setItem('user_saved_address', def.full_address)
            } else {
              const dismissed = localStorage.getItem('location_prompt_dismissed')
              if (!dismissed) setShowLocationBanner(true)
            }
          })
          .catch(() => {
            const dismissed = localStorage.getItem('location_prompt_dismissed')
            if (!dismissed) setShowLocationBanner(true)
          })
      }
    }
  }, [])

  const openAddress = () => {
    setIsLocationModalOpen(true)
  }

  const handleAddressSelected = (fullAddress, shortArea) => {
    setCurrentArea(shortArea || 'Nagpur, MH')
    setShowLocationBanner(false)
  }

  const dismissBanner = () => {
    setShowLocationBanner(false)
    try {
      localStorage.setItem('location_prompt_dismissed', 'true')
    } catch (e) {
      console.error(e)
    }
  }

  const openProfile = () => {
    router.push('/profile')
  }

  return (
    <>
      {/* Subtle Live Location Prompt Banner on first visit */}
      {showLocationBanner && (
        <div className="bg-[#fff4ed] border-b border-orange-200 px-4 py-2 text-xs text-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 max-w-4xl mx-auto flex-1">
            <LocateFixed size={14} className="text-[#ff8a4c] shrink-0" />
            <span className="truncate">
              Enable your live device location for precise specialist matching in your area.
            </span>
            <button
              onClick={openAddress}
              className="text-xs font-bold text-[#ff8a4c] hover:text-[#f07432] underline shrink-0 cursor-pointer ml-1"
            >
              Set Location Now
            </button>
          </div>
          <button
            onClick={dismissBanner}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded-sm shrink-0 cursor-pointer"
            aria-label="Dismiss location banner"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs px-4 py-3">
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
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer shadow-2xs"
            aria-label="Select address location"
          >
            <MapPin size={15} className="text-[#ff8a4c] shrink-0" />
            <span className="truncate max-w-[130px] sm:max-w-[220px] text-slate-800 font-medium">
              {currentArea}
            </span>
            <ChevronDown size={14} className="text-slate-400 shrink-0" />
          </button>

          {/* Right Side: Profile Icon */}
          <button
            onClick={openProfile}
            className="w-9 h-9 rounded-sm bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center transition cursor-pointer shadow-2xs shrink-0"
            aria-label="Profile"
            title="Account Profile"
          >
            <User size={16} />
          </button>

        </div>
      </header>

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectAddress={handleAddressSelected}
      />
    </>
  )
}

