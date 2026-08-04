'use client'

import Header from '../components/Header'
import BackHeader from './components/BackHeader'
import { useEffect, useState } from 'react'
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
  ShieldCheck,
  Copy,
  Check,
  Gift
} from 'lucide-react'
import { API_BASE_URL } from '@/lib/api'

export default function ProfilePage() {
  const router = useRouter()
  const [referral, setReferral] = useState({ code: '', points: 0 })
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) return

    fetch(`${API_BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (data) {
          setReferral({ code: data.referral_code || '', points: data.referral_points || 0 })
        }
      })
      .catch((error) => console.error('Failed to load referral details:', error))
  }, [])

  const referralLink = referral.code && typeof window !== 'undefined'
    ? `${window.location.origin}/login?ref=${encodeURIComponent(referral.code)}`
    : ''

  const copyReferralLink = async () => {
    if (!referralLink) return
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.clear()
    }
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />
      <BackHeader title="Customer Account" />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
        
        {/* User Card */}
        <div className="bg-white rounded-md border border-slate-200 p-6 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-md bg-[#ff8a4c] text-white flex items-center justify-center font-bold text-xl shadow-md shadow-orange-500/20 shrink-0">
            K
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 truncate">Customer Account</h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-sm border border-emerald-200">
                <ShieldCheck size={11} /> Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Manage your Kazilen service bookings & preferences</p>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="bg-white rounded-md border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
          <ProfileItem
            icon={<User size={18} className="text-[#ff8a4c]" />}
            label="Your Profile Details"
            sub="View and update personal info"
            onClick={() => router.push('/profile/user')}
          />

          <ProfileItem
            icon={<Star size={18} className="text-amber-500" />}
            label="Ratings & Service Reviews"
            sub="Feedback submitted for technicians"
            onClick={() => router.push('/profile/rating')}
          />

          <ProfileItem
            icon={<ClipboardList size={18} className="text-[#ff8a4c]" />}
            label="Booking History & Orders"
            sub="View active and completed service requests"
            onClick={() => router.push('/profile/orders')}
          />

          <ProfileItem
            icon={<MapPin size={18} className="text-slate-600" />}
            label="Saved Address Book"
            sub="Manage home & office delivery addresses"
            onClick={() => router.push('/select-address')}
          />

          <ProfileItem
            icon={<HelpCircle size={18} className="text-slate-600" />}
            label="Support & Help Center"
            sub="24/7 customer assistance"
            onClick={() => router.push('/profile/help')}
          />

          <ProfileItem
            icon={<Info size={18} className="text-slate-600" />}
            label="About Kazilen"
            sub="Terms, privacy policy and version"
            onClick={() => router.push('/profile/about')}
          />
        </div>

        <section className="bg-white rounded-md border border-slate-200 p-5 shadow-xs">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-sm bg-[#fff4ed] text-[#ff8a4c]"><Gift size={18} /></div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Refer a friend</h2>
                <p className="text-xs text-slate-500 mt-1">Share your code and earn one referral point when a new customer joins.</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-slate-900">{referral.points}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Points</p>
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-sm px-3 py-2.5 text-sm font-bold tracking-[0.2em] text-slate-900">
              {referral.code || 'Loading code'}
            </div>
            <button
              type="button"
              onClick={copyReferralLink}
              disabled={!referralLink}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-sm bg-[#ff8a4c] hover:bg-[#f07432] text-white text-xs font-bold transition disabled:bg-slate-200 disabled:text-slate-400"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? 'Copied' : 'Copy invite link'}
            </button>
          </div>
        </section>

        {/* Logout CTA */}
        <div className="pt-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-5 py-4 bg-white rounded-md border border-red-200 text-red-600 hover:bg-red-50/50 text-xs font-bold transition cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-3">
              <LogOut size={18} />
              <span>Log out from account</span>
            </div>
            <ChevronRight size={18} className="text-red-400" />
          </button>
        </div>
      </main>
    </div>
  )
}

function ProfileItem({ icon, label, sub, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 transition cursor-pointer group"
    >
      <div className="flex items-center gap-3.5">
        <div className="p-2 rounded-sm bg-slate-100/80 group-hover:bg-[#fff4ed] transition-colors">
          {icon}
        </div>
        <div className="text-left">
          <span className="block font-bold text-slate-900 text-sm group-hover:text-[#ff8a4c] transition-colors">
            {label}
          </span>
          {sub && <span className="text-xs font-normal text-slate-500">{sub}</span>}
        </div>
      </div>
      <ChevronRight size={18} className="text-slate-400 group-hover:text-[#ff8a4c] transition-colors" />
    </button>
  )
}
