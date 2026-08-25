'use client'

import { useState, useEffect } from 'react'
import {
  X,
  MapPin,
  LocateFixed,
  Loader2,
  Check,
  AlertCircle,
  Home,
  Briefcase,
  Building,
  Plus,
  Bookmark
} from 'lucide-react'
import { API_BASE_URL, apiFetch } from '@/lib/api'

export default function LocationModal({ isOpen, onClose, onSelectAddress, initialAddress = '' }) {
  const [savedAddresses, setSavedAddresses] = useState([])
  const [loadingSaved, setLoadingSaved] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  const [locating, setLocating] = useState(false)
  const [savingDb, setSavingDb] = useState(false)
  const [locationError, setLocationError] = useState('')
  const [addressType, setAddressType] = useState('Home') // Home | Work | Other
  const [isDefault, setIsDefault] = useState(false)
  const [coords, setCoords] = useState(null)

  const [formData, setFormData] = useState({
    flatNo: '',
    street: '',
    area: '',
    landmark: '',
    city: 'Nagpur',
    pincode: ''
  })

  // Load saved addresses from DB whenever modal opens
  useEffect(() => {
    if (!isOpen) return
    setLoadingSaved(true)
    apiFetch(`${API_BASE_URL}/addresses`, {
      headers: { }
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const addrs = Array.isArray(data) ? data : []
        setSavedAddresses(addrs)
        if (addrs.length === 0) {
          setShowAddForm(true)
        } else {
          setShowAddForm(false)
        }
      })
      .catch((err) => {
        console.error('Failed to load saved addresses:', err)
        setShowAddForm(true)
      })
      .finally(() => setLoadingSaved(false))
  }, [isOpen])

  if (!isOpen) return null

  // Fetch device GPS and reverse geocode
  const handleDetectLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.')
      return
    }

    setLocating(true)
    setLocationError('')
    setShowAddForm(true)

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        setCoords({ latitude: String(latitude), longitude: String(longitude) })

        try {
          // OpenStreetMap Nominatim reverse geocode
          const response = await apiFetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en'
              }
            }
          )

          if (response.ok) {
            const data = await response.json()
            const addr = data.address || {}

            const streetVal = addr.road || addr.street || addr.suburb || ''
            const areaVal = addr.neighbourhood || addr.suburb || addr.residential || addr.city_district || addr.subdistrict || ''
            const cityVal = addr.city || addr.town || addr.municipality || addr.county || 'Nagpur'
            const pincodeVal = addr.postcode || ''
            const houseVal = addr.house_number || ''

            setFormData((prev) => ({
              ...prev,
              flatNo: prev.flatNo || houseVal,
              street: streetVal,
              area: areaVal || (addr.state_district ? addr.state_district : 'Nagpur'),
              city: cityVal,
              pincode: pincodeVal
            }))

            // Save detected coords for reference
            try {
              localStorage.setItem('user_location_coords', JSON.stringify({ latitude, longitude }))
              const shortArea = areaVal ? `${areaVal}, ${cityVal}` : cityVal
              localStorage.setItem('user_location_area', shortArea)
            } catch (e) {
              console.error('Failed to save coords:', e)
            }
          } else {
            setLocationError('Could not fetch address details for your location. Please type manually.')
          }
        } catch (err) {
          console.error('Reverse geocode error:', err)
          setLocationError('Network error reading location. Please type your address.')
        } finally {
          setLocating(false)
        }
      },
      (error) => {
        setLocating(false)
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('Location permission was denied. Please allow location access in your browser or type address manually.')
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationError('Location information is currently unavailable on this device.')
        } else if (error.code === error.TIMEOUT) {
          setLocationError('Location request timed out. Please try again or type address manually.')
        } else {
          setLocationError('Unable to retrieve device location.')
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    )
  }

  // Handle selecting an existing saved address
  const handleSelectSaved = (savedAddr) => {
    const fullAddress = savedAddr.full_address
    const shortArea = savedAddr.area ? `${savedAddr.area}, ${savedAddr.city || 'Nagpur'}` : (savedAddr.city || 'Nagpur')

    try {
      localStorage.setItem('user_saved_address', fullAddress)
      localStorage.setItem('user_location_area', shortArea)
      if (savedAddr.latitude && savedAddr.longitude) {
        localStorage.setItem(
          'user_location_coords',
          JSON.stringify({ latitude: savedAddr.latitude, longitude: savedAddr.longitude })
        )
      }
    } catch (e) {
      console.error('Failed to cache address:', e)
    }

    if (onSelectAddress) {
      onSelectAddress(fullAddress, shortArea, savedAddr)
    }
    onClose()
  }

  // Save new address (to DB if logged in, and localStorage)
  const handleSave = async (e) => {
    e.preventDefault()

    const parts = [
      formData.flatNo?.trim(),
      formData.landmark ? `Near ${formData.landmark.trim()}` : '',
      formData.street?.trim(),
      formData.area?.trim(),
      formData.city?.trim() || 'Nagpur',
      formData.pincode ? `- ${formData.pincode.trim()}` : ''
    ].filter(Boolean)

    const fullAddress = parts.join(', ').replace(', -', ' -')

    if (!fullAddress.trim()) {
      setLocationError('Please provide at least a flat / house number and locality.')
      return
    }

    const shortArea = formData.area ? `${formData.area}, ${formData.city || 'Nagpur'}` : (formData.city || 'Nagpur')

    try {
      localStorage.setItem('user_saved_address', fullAddress)
      localStorage.setItem('user_location_area', shortArea)
    } catch (e) {
      console.error('Failed to cache address:', e)
    }

    // Save to backend database (auth cookie is sent automatically)
    {
      setSavingDb(true)
      try {
        await apiFetch(`${API_BASE_URL}/addresses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tag: addressType,
            flat_no: formData.flatNo.trim(),
            street: formData.street?.trim() || null,
            area: formData.area.trim(),
            landmark: formData.landmark?.trim() || null,
            city: formData.city?.trim() || 'Nagpur',
            pincode: formData.pincode?.trim() || null,
            full_address: fullAddress,
            latitude: coords?.latitude || null,
            longitude: coords?.longitude || null,
            is_default: isDefault
          })
        })
      } catch (err) {
        console.error('Failed to persist address to DB:', err)
      } finally {
        setSavingDb(false)
      }
    }

    if (onSelectAddress) {
      onSelectAddress(fullAddress, shortArea)
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-md border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-sm bg-[#fff4ed] text-[#ff8a4c] flex items-center justify-center">
              <MapPin size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Select Service Location</h3>
              <p className="text-[11px] text-slate-500">Pick a saved address or enter a new one</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-sm hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Quick GPS Auto-Detect Button */}
          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={locating}
            className="w-full py-2.5 px-4 rounded-sm border border-[#ff8a4c] bg-[#fff4ed] hover:bg-[#ffe9dc] text-slate-900 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs disabled:opacity-60"
          >
            {locating ? (
              <>
                <Loader2 size={14} className="animate-spin text-[#ff8a4c]" />
                <span>Detecting Device GPS Location…</span>
              </>
            ) : (
              <>
                <LocateFixed size={14} className="text-[#ff8a4c]" />
                <span>Use Current Device Location (Auto-Detect GPS)</span>
              </>
            )}
          </button>

          {locationError && (
            <div className="flex items-start gap-2 p-3 rounded-sm bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span className="leading-relaxed">{locationError}</span>
            </div>
          )}

          {/* Section: Saved Addresses (if available) */}
          {savedAddresses.length > 0 && !showAddForm && (
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Bookmark size={12} className="text-[#ff8a4c]" />
                  Saved Addresses ({savedAddresses.length})
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className="text-xs font-bold text-[#ff8a4c] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="space-y-2">
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => handleSelectSaved(addr)}
                    className="p-3 rounded-sm border border-slate-200 hover:border-[#ff8a4c] hover:bg-[#fff4ed]/30 transition cursor-pointer flex items-start justify-between gap-3 group"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 group-hover:bg-[#ff8a4c] group-hover:text-white transition">
                          {addr.tag || 'Home'}
                        </span>
                        {addr.is_default && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-sm border border-emerald-200">
                            Default
                          </span>
                        )}
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {addr.area || addr.city}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-snug line-clamp-2">
                        {addr.full_address}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="shrink-0 px-2.5 py-1 text-[11px] font-bold rounded-sm bg-slate-100 group-hover:bg-[#ff8a4c] text-slate-700 group-hover:text-white transition"
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Add / Edit Address Form */}
          {(showAddForm || savedAddresses.length === 0) && (
            <div className="space-y-3 pt-1">
              {savedAddresses.length > 0 && (
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">Enter New Address Details</span>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                  >
                    Back to Saved Addresses
                  </button>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSave} className="space-y-3">
                {/* Address Type Tag */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Address Tag
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'Home', label: 'Home', icon: Home },
                      { id: 'Work', label: 'Work', icon: Briefcase },
                      { id: 'Other', label: 'Other', icon: Building }
                    ].map((item) => {
                      const Icon = item.icon
                      const isSelected = addressType === item.id
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setAddressType(item.id)}
                          className={`py-2 px-3 rounded-sm border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-[#ff8a4c] text-white border-[#ff8a4c]'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <Icon size={13} />
                          <span>{item.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Flat / Building */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    House / Flat / Building / Floor <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.flatNo}
                    onChange={(e) => setFormData({ ...formData, flatNo: e.target.value })}
                    placeholder="e.g. Flat 402, Royal Palms Apartment"
                    className="w-full bg-white border border-slate-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:border-[#ff8a4c] outline-none"
                  />
                </div>

                {/* Street / Road */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Street / Road
                  </label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="e.g. West High Court Road"
                    className="w-full bg-white border border-slate-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:border-[#ff8a4c] outline-none"
                  />
                </div>

                {/* Area / Locality */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Area / Locality <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      placeholder="e.g. Dharampeth / Sadar"
                      className="w-full bg-white border border-slate-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:border-[#ff8a4c] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      placeholder="e.g. Near Traffic Park"
                      className="w-full bg-white border border-slate-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:border-[#ff8a4c] outline-none"
                    />
                  </div>
                </div>

                {/* City & Pincode */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Nagpur"
                      className="w-full bg-white border border-slate-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:border-[#ff8a4c] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                      placeholder="e.g. 440010"
                      className="w-full bg-white border border-slate-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:border-[#ff8a4c] outline-none"
                    />
                  </div>
                </div>

                {/* Default checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isDefaultAddr"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="w-4 h-4 text-[#ff8a4c] rounded-xs border-slate-300 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="isDefaultAddr" className="text-xs text-slate-700 font-medium cursor-pointer">
                    Save as my primary default address
                  </label>
                </div>

                {/* Modal Actions */}
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-sm border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingDb}
                    className="px-5 py-2.5 rounded-sm bg-[#ff8a4c] hover:bg-[#f07432] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-60"
                  >
                    {savingDb ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Saving…</span>
                      </>
                    ) : (
                      <>
                        <Check size={14} />
                        <span>Save & Use Address</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}
