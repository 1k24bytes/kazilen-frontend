'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import BackHeader from '../profile/components/BackHeader'
import LocationModal from '../components/LocationModal'
import { MapPin, Plus, Trash2, CheckCircle2, Bookmark, Home, Briefcase, Building, Loader2 } from 'lucide-react'
import { API_BASE_URL, apiFetch } from '@/lib/api'

export default function SavedAddressesPage() {
  const router = useRouter()
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState(null)

  const fetchAddresses = async () => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/addresses`, {
        headers: { }
      })
      if (res.ok) {
        const data = await res.json()
        setAddresses(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('Failed to load addresses:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

  const handleSetDefault = async (addressId) => {
    setActionLoadingId(addressId)
    try {
      const res = await apiFetch(`${API_BASE_URL}/addresses/${addressId}/default`, {
        method: 'PATCH'
      })
      if (res.ok) {
        await fetchAddresses()
      }
    } catch (err) {
      console.error('Failed to set default address:', err)
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleDelete = async (addressId) => {
    if (!confirm('Are you sure you want to delete this saved address?')) return

    setActionLoadingId(addressId)
    try {
      const res = await apiFetch(`${API_BASE_URL}/addresses/${addressId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        await fetchAddresses()
      }
    } catch (err) {
      console.error('Failed to delete address:', err)
    } finally {
      setActionLoadingId(null)
    }
  }

  const getTagIcon = (tag) => {
    const lower = (tag || '').toLowerCase()
    if (lower === 'work') return <Briefcase size={14} />
    if (lower === 'other') return <Building size={14} />
    return <Home size={14} />
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      <BackHeader title="Saved Addresses" />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Top Header Card */}
        <div className="flex items-center justify-between bg-white rounded-md border border-slate-200 p-4 shadow-2xs">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Manage Saved Locations</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Addresses saved here are automatically available during booking checkout.
            </p>
          </div>

          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="px-3.5 py-2 rounded-sm bg-[#ff8a4c] hover:bg-[#f07432] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
          >
            <Plus size={14} />
            <span>Add Address</span>
          </button>
        </div>

        {/* Address List */}
        {loading ? (
          <div className="bg-white rounded-md border border-slate-200 p-8 text-center space-y-2">
            <Loader2 size={20} className="animate-spin text-[#ff8a4c] mx-auto" />
            <p className="text-xs text-slate-500">Loading saved addresses…</p>
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-md border border-slate-200 p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-sm bg-[#fff4ed] text-[#ff8a4c] flex items-center justify-center mx-auto">
              <MapPin size={22} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">No saved addresses yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Add your home or office address using GPS auto-detect or manual entry for faster bookings.
              </p>
            </div>
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="px-4 py-2 rounded-sm bg-[#ff8a4c] hover:bg-[#f07432] text-white text-xs font-bold transition inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Plus size={14} />
              <span>Add Your First Address</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`bg-white rounded-md border p-4 shadow-2xs transition ${
                  addr.is_default ? 'border-[#ff8a4c]/60 ring-1 ring-[#ff8a4c]/30' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 ${
                        addr.is_default
                          ? 'bg-[#fff4ed] text-[#ff8a4c]'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {getTagIcon(addr.tag)}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">
                          {addr.tag || 'Home'}
                        </span>
                        {addr.is_default && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-sm border border-emerald-200">
                            Primary Default
                          </span>
                        )}
                        <span className="text-[11px] font-semibold text-slate-500">
                          • {addr.area}, {addr.city}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed break-words">
                        {addr.full_address}
                      </p>

                      {addr.landmark && (
                        <p className="text-[11px] text-slate-400">
                          Landmark: Near {addr.landmark}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {!addr.is_default && (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(addr.id)}
                        disabled={actionLoadingId === addr.id}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-sm border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                      >
                        Set Default
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(addr.id)}
                      disabled={actionLoadingId === addr.id}
                      className="p-1.5 rounded-sm hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
                      title="Delete Address"
                      aria-label="Delete Address"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => {
          setIsLocationModalOpen(false)
          fetchAddresses()
        }}
        onSelectAddress={() => {
          fetchAddresses()
        }}
      />

      <BottomNav />
    </div>
  )
}
