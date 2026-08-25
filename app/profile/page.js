'use client'

import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import BackHeader from './components/BackHeader'
import PlatformFeedbackModal from './components/PlatformFeedbackModal'
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
  Gift,
  HeartHandshake,
} from 'lucide-react'
import { API_BASE_URL, apiFetch } from '@/lib/api'

export default function ProfilePage() {
  const router = useRouter()
  const [userProfile, setUserProfile] = useState({ full_name: '', phone_number: '', role: 'customer' })
  const [referral, setReferral] = useState({ code: '', points: 0 })
  const [copied, setCopied] = useState(false)
  const [activeOtpBookings, setActiveOtpBookings] = useState([])
  const [copiedOtp, setCopiedOtp] = useState(null)
  const [platformFeedback, setPlatformFeedback] = useState(null)
  const [showPlatformModal, setShowPlatformModal] = useState(false)

  const fetchActiveBookings = async () => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/bookings/my`, {
        headers: { }
      })
      if (res.ok) {
        const data = await res.json()
        const active = (data.bookings || []).filter(
          (b) => (b.status === 'accepted' && b.start_otp) || (b.status === 'in_progress' && b.end_otp)
        )
        setActiveOtpBookings(active)
      }
    } catch (e) {
      console.error('Failed to fetch active bookings:', e)
    }
  }

  const fetchPlatformFeedback = async () => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/reviews/platform/me`, {
        headers: { }
      })
      if (res.ok) {
        const data = await res.json()
        if (data.submitted && data.feedback) {
          setPlatformFeedback(data.feedback)
        }
      }
    } catch (e) {
      console.error('Failed to load platform feedback:', e)
    }
  }

  useEffect(() => {
    const savedName = localStorage.getItem('kazilen_professional_name') || localStorage.getItem('userName') || localStorage.getItem('user_name') || ''
    const savedPhone = localStorage.getItem('user_phone') || localStorage.getItem('phone') || ''

    if (savedName || savedPhone) {
      setUserProfile({ full_name: savedName, phone_number: savedPhone, role: 'customer' })
    }

    apiFetch(`${API_BASE_URL}/users/me`, {
      headers: { }
    })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (data) {
          setUserProfile({
            full_name: data.full_name || savedName || '',
            phone_number: data.phone_number || savedPhone || '',
            role: data.role || 'customer'
          })
          if (data.full_name) localStorage.setItem('kazilen_professional_name', data.full_name)
          if (data.phone_number) localStorage.setItem('user_phone', data.phone_number)
          setReferral({ code: data.referral_code || '', points: data.referral_points || 0 })
        }
      })
      .catch((error) => console.error('Failed to load user details:', error))

    fetchActiveBookings()
    fetchPlatformFeedback()
    const interval = setInterval(() => {
      fetchActiveBookings()
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const handleCopyOtp = async (otp, id) => {
    if (!otp) return
    await navigator.clipboard.writeText(otp)
    setCopiedOtp(id)
    setTimeout(() => setCopiedOtp(null), 2000)
  }

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
    try {
      await apiFetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' })
    } catch {
      // ignore network errors, still clear local state
    }
    if (typeof window !== 'undefined') {
      localStorage.clear()
    }
    window.location.href = '/login'
  }

  const displayName = userProfile.full_name?.trim() || 'Customer Account'
  const initial = (userProfile.full_name?.trim() || 'K').charAt(0).toUpperCase()
  const formatPhone = (raw) => {
    if (!raw) return ''
    let clean = raw.replace(/\D/g, '')
    if (clean.length > 10 && clean.startsWith('91')) {
      clean = clean.substring(2)
    }
    return clean ? `+91 ${clean}` : ''
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />
      <BackHeader title={displayName} />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
        
        {/* User Card */}
        <div className="bg-white rounded-md border border-slate-200 p-6 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-md bg-[#ff8a4c] text-white flex items-center justify-center font-bold text-xl shadow-md shadow-orange-500/20 shrink-0">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900 truncate">{displayName}</h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-sm border border-emerald-200">
                  <ShieldCheck size={11} /> Verified Customer
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                {userProfile.phone_number ? `${formatPhone(userProfile.phone_number)} · ` : ''}Manage your Kazilen service bookings & preferences
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push('/profile/user')}
            className="px-3.5 py-2 rounded-sm border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition shrink-0 cursor-pointer"
          >
            Edit Profile
          </button>
        </div>

        {/* Active Service OTP Banners (Job Start / Completion) */}
        {activeOtpBookings.length > 0 && (
          <div className="space-y-4">
            {activeOtpBookings.map((b) => {
              const isStart = b.status === 'accepted' && b.start_otp
              const isEnd = b.status === 'in_progress' && b.end_otp
              const activeOtp = isStart ? b.start_otp : b.end_otp
              const formattedService = b.service_id?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

              return (
                <div
                  key={b.id}
                  className={`rounded-md border p-5 shadow-2xs ${
                    isStart
                      ? 'bg-amber-50/70 border-amber-300'
                      : 'bg-emerald-50/70 border-emerald-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-sm border ${
                          isStart
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        <ShieldCheck size={12} />
                        {isStart ? 'Job Start Verification' : 'Job Completion Verification'}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        Booking #{b.id}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-600">
                      {formattedService} ({b.date} · {b.time_slot})
                    </span>
                  </div>

                  <div className="my-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        {isStart ? '6-Digit Start OTP' : '6-Digit Completion OTP'}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {isStart
                          ? 'Read this code to your technician to start the service.'
                          : 'Read this code to your technician to confirm job completion.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-white border border-slate-300 rounded-sm px-5 py-2.5 text-center shadow-2xs">
                        <span className="text-2xl sm:text-3xl font-mono font-extrabold tracking-[0.35em] text-slate-900 select-all">
                          {activeOtp}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyOtp(activeOtp, b.id)}
                        className="px-3 py-3 rounded-sm bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                        title="Copy OTP"
                      >
                        {copiedOtp === b.id ? (
                          <Check size={15} className="text-emerald-600" />
                        ) : (
                          <Copy size={15} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <p className="text-[11px] text-slate-500">
                      Secure in-portal verification. Do not share with unauthorized persons.
                    </p>
                    <button
                      onClick={() => router.push(`/profile/orders/${b.id}`)}
                      className="text-xs font-bold text-[#ff8a4c] hover:text-[#f07432] flex items-center gap-1"
                    >
                      <span>Booking Details</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

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
            icon={<HeartHandshake size={18} className="text-[#ff8a4c]" />}
            label="Rate Kazilen Platform"
            sub={
              platformFeedback
                ? `You rated Kazilen ${platformFeedback.rating}★ · Click to view or edit`
                : "One-time overall feedback for the Kazilen platform"
            }
            badge={platformFeedback ? `${platformFeedback.rating}★ Submitted` : undefined}
            onClick={() => setShowPlatformModal(true)}
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
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-sm bg-[#ff8a4c] hover:bg-[#f07432] text-white text-xs font-bold transition disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer"
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

      {/* One-Time Platform Feedback Modal */}
      {showPlatformModal && (
        <PlatformFeedbackModal
          initialFeedback={platformFeedback}
          onClose={() => setShowPlatformModal(false)}
          onSaved={(feedback) => {
            setPlatformFeedback(feedback)
          }}
        />
      )}

      <BottomNav />
    </div>
  )
}

function ProfileItem({ icon, label, sub, badge, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 transition cursor-pointer group"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="p-2 rounded-sm bg-slate-100/80 group-hover:bg-[#fff4ed] transition-colors shrink-0">
          {icon}
        </div>
        <div className="text-left min-w-0">
          <div className="flex items-center gap-2">
            <span className="block font-bold text-slate-900 text-sm group-hover:text-[#ff8a4c] transition-colors truncate">
              {label}
            </span>
            {badge && (
              <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                {badge}
              </span>
            )}
          </div>
          {sub && <span className="text-xs font-normal text-slate-500 block truncate">{sub}</span>}
        </div>
      </div>
      <ChevronRight size={18} className="text-slate-400 group-hover:text-[#ff8a4c] transition-colors shrink-0" />
    </button>
  )
}
