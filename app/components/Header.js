// frontend/src/app/components/Header.js
'use client'

import { MapPin, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
// import { useAuth } from '@/context/AuthContext'
// import SearchBar from './SearchBar'

export default function Header() {
  const router = useRouter()

  const openAddress = () => {
    router.push('/select-address')
  }

  const openProfile = () => {
    router.push('/profile')
  }

  return (
    <div className="px-4 py-3 bg-white shadow-sm flex flex-col gap-3">
      <div className="flex justify-between items-start">
        {/* Address Section */}
        <button
          onClick={openAddress}
          className="text-left"
          aria-label="Select address"
        >
          <div className="flex items-center text-sm font-medium text-gray-700">
            <MapPin size={16} className="text-red-500 mr-1" />
            Address
            <ChevronDown size={14} className="ml-1 text-gray-600" />
          </div>

        </button>

        {/* Center - City Availability */}
        <div className="justify-self-center">
          <span className="text-sm font-semibold text-orange-600 whitespace-nowrap">
            Available in Nagpur
          </span>
        </div>


        {/* Profile Button */}
        <button
          onClick={openProfile}
          className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold"
          title="Open profile"
          aria-label="Open profile"
        >
          P
        </button>
      </div>

      {/* Search */}
      {/* <SearchBar /> */}
    </div>
  )
}
