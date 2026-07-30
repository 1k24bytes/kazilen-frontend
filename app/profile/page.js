'use client'

import BackHeader from './components/BackHeader'
import { useRouter } from 'next/navigation'
import {
  ChevronRight,
  User,
  Star,
  ClipboardList,
  MapPin,
  HelpCircle,
  Info,
  LogOut,
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.clear()
    }
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-900">
      <BackHeader />

      <main className="max-w-xl mx-auto px-4 py-6 space-y-3">
        <div className="bg-white rounded-lg border border-zinc-200/80 shadow-2xs divide-y divide-zinc-100 overflow-hidden">
          <ProfileItem
            icon={<User size={18} className="text-zinc-600" />}
            label="Your profile"
            onClick={() => router.push('/profile/user')}
          />

          <ProfileItem
            icon={<Star size={18} className="text-amber-500" />}
            label="Your ratings & reviews"
            onClick={() => router.push('/profile/rating')}
          />

          <ProfileItem
            icon={<ClipboardList size={18} className="text-zinc-600" />}
            label="Booking history & orders"
            onClick={() => router.push('/profile/orders')}
          />

          <ProfileItem
            icon={<MapPin size={18} className="text-zinc-600" />}
            label="Saved address book"
            onClick={() => router.push('/select-address')}
          />

          <ProfileItem
            icon={<HelpCircle size={18} className="text-zinc-600" />}
            label="Support & help center"
            onClick={() => router.push('/profile/help')}
          />

          <ProfileItem
            icon={<Info size={18} className="text-zinc-600" />}
            label="About Kazilen"
            onClick={() => router.push('/profile/about')}
          />
        </div>

        <div className="pt-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-red-200/60 text-red-600 hover:bg-red-50/50 text-xs font-semibold transition cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <LogOut size={16} />
              <span>Log out from account</span>
            </div>
            <ChevronRight size={16} className="text-red-400" />
          </button>
        </div>
      </main>
    </div>
  )
}

function ProfileItem({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3.5 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-800 transition cursor-pointer"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      <ChevronRight size={16} className="text-zinc-400" />
    </button>
  )
}
