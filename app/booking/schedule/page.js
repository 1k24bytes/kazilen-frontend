"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Clock, MapPin, ArrowLeft, ArrowRight, CheckCircle2, Zap, ShieldCheck, LocateFixed, AlertCircle } from "lucide-react";
import servicesData from "../../data/services.json";
import { API_BASE_URL, apiFetch } from "@/lib/api";
import Header from "@/app/components/Header";
import LocationModal from "@/app/components/LocationModal";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateTimeSlots() {
  const slots = [];
  const today = new Date();
  for (let day = 0; day < 8; day++) {
    const d = new Date(today);
    d.setDate(today.getDate() + day);
    const dateStr = d.toISOString().split("T")[0];
    // Slots: 09:00 – 21:00, 1-hour gaps
    const startHour = day === 0 ? Math.max(9, new Date().getHours() + 1) : 9;
    for (let h = startHour; h < 21; h++) {
      slots.push({
        date: dateStr,
        time: `${String(h).padStart(2, "0")}:00`,
        endTime: `${String(h + 1).padStart(2, "0")}:00`,
      });
    }
  }
  return slots;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BookingSchedulePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const workerId = searchParams.get("worker_id");
  const serviceId = searchParams.get("action");
  const amount = searchParams.get("amount"); // base price string
  const rawPriceType = searchParams.get("price_type");

  const subCategory = servicesData?.subCategories?.find((s) => s.id === serviceId);
  const isFixedPrice = rawPriceType === "fixed" || (!rawPriceType && subCategory?.default_price_type === "fixed");
  const priceType = isFixedPrice ? "fixed" : "hourly";

  const allSlots = generateTimeSlots();
  const todayStr = new Date().toISOString().split("T")[0];

  // Booking mode: "asap" (Reach ASAP) vs "scheduled" (Pick date & slot)
  const [bookingMode, setBookingMode] = useState("asap");

  // Step 1 state
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedTime, setSelectedTime] = useState(""); // start hour "HH:00"
  const [duration, setDuration] = useState(1);          // hours: 1 | 2 | 3 | 4

  // Step 2 state
  const [address, setAddress] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const res = await apiFetch(`${API_BASE_URL}/addresses`, {
        headers: { }
      });
      if (res.ok) {
        const data = await res.json();
        const addrs = Array.isArray(data) ? data : [];
        setSavedAddresses(addrs);
        if (addrs.length > 0) {
          const defaultAddr = addrs.find((a) => a.is_default) || addrs[0];
          setSelectedAddressId(defaultAddr.id);
          setAddress(defaultAddr.full_address);
        } else {
          const saved = localStorage.getItem("user_saved_address");
          if (saved) setAddress(saved);
        }
      }
    } catch (err) {
      console.error("Failed to load saved addresses:", err);
      const saved = localStorage.getItem("user_saved_address");
      if (saved) setAddress(saved);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // UI state
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Booked slots state
  const [bookedHours, setBookedHours] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [isDayOff, setIsDayOff] = useState(false);
  const [dayOffName, setDayOffName] = useState("");
  const [deadHours, setDeadHours] = useState([]);

  // Unique dates for the date picker row
  const uniqueDates = [...new Set(allSlots.map((s) => s.date))];

  // Time slots for the selected date
  const timeSlotsForDate = allSlots.filter((s) => s.date === selectedDate);

  // Derived: end time based on start + duration
  const endHour = selectedTime
    ? String(parseInt(selectedTime.split(":")[0]) + duration).padStart(2, "0") + ":00"
    : "";

  // Max duration user can select without going past 21:00
  const maxDuration = selectedTime
    ? Math.min(4, 21 - parseInt(selectedTime.split(":")[0]))
    : 4;

  // Check if all hours in [start, start+duration) are free
  const isRangeAvailable = (startHour, hrs) => {
    const startH = parseInt(startHour.split(":")[0]);
    for (let i = 0; i < hrs; i++) {
      const h = String(startH + i).padStart(2, "0") + ":00";
      if (bookedHours.includes(h)) return false;
    }
    return true;
  };

  const canProceedToStep2 =
    bookingMode === "asap" ||
    (!isDayOff && selectedDate && selectedTime && endHour && isRangeAvailable(selectedTime, duration));

  const canConfirm = address.trim().length > 5;

  // Total amount calculation
  const totalAmount = isFixedPrice
    ? amount || (subCategory?.default_fixed_price ? String(subCategory.default_fixed_price) : "249")
    : amount
    ? String(parseInt(amount) * duration)
    : "199";

  // ---------------------------------------------------------------------------
  // Fetch booked slots whenever worker + date changes (only when scheduled)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!workerId || !selectedDate || bookingMode !== "scheduled") {
      setBookedHours([]);
      setIsDayOff(false);
      setDayOffName("");
      setDeadHours([]);
      return;
    }
    setSlotsLoading(true);
    apiFetch(`${API_BASE_URL}/bookings/worker-slots?worker_id=${workerId}&date=${selectedDate}`)
      .then((r) => r.json())
      .then((data) => {
        setBookedHours(data.booked_hours || []);
        setIsDayOff(Boolean(data.is_day_off));
        setDayOffName(data.day_off_name || "");
        setDeadHours(data.dead_hours || []);
      })
      .catch(() => {
        setBookedHours([]);
        setIsDayOff(false);
        setDayOffName("");
        setDeadHours([]);
      })
      .finally(() => setSlotsLoading(false));
  }, [workerId, selectedDate, bookingMode]);

  // When duration changes, re-validate selected start time
  useEffect(() => {
    if (selectedTime && !isRangeAvailable(selectedTime, duration)) {
      setSelectedTime("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, bookedHours]);

  // ---------------------------------------------------------------------------
  // Step 1 → Step 2
  // ---------------------------------------------------------------------------
  const handleNextStep = () => {
    if (!canProceedToStep2) {
      setError("Please select a valid booking time.");
      return;
    }
    setError("");
    setStep(2);
  };

  // ---------------------------------------------------------------------------
  // Confirm booking (Step 2)
  // ---------------------------------------------------------------------------
  const handleConfirm = async () => {
    if (!canConfirm) {
      setError("Please enter a valid address with at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");

    const dateToSend = bookingMode === "asap" ? todayStr : selectedDate;
    const timeSlotToSend = bookingMode === "asap" ? "Instant / ASAP" : `${selectedTime}-${endHour}`;

    try {
      const res = await apiFetch(`${API_BASE_URL}/bookings/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          worker_id: parseInt(workerId),
          service_id: serviceId,
          date: dateToSend,
          time_slot: timeSlotToSend,
          address: address.trim(),
          amount: totalAmount,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/profile/orders");
      } else {
        setError(data.detail || "Booking failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <Header />

      {/* Step sub-bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => (step === 2 ? setStep(1) : router.back())}
          className="w-8 h-8 flex items-center justify-center rounded-sm bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
        >
          <ArrowLeft size={16} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-sm font-bold text-slate-900">
            {step === 1 ? "Schedule Your Service" : "Confirm Booking"}
          </h1>
          <p className="text-xs text-slate-500">{subCategory?.label || serviceId}</p>
        </div>
        {/* Step indicator */}
        <div className="ml-auto flex items-center gap-1.5">
          <span className={`w-6 h-1.5 rounded-sm ${step >= 1 ? "bg-[#ff8a4c]" : "bg-slate-200"}`} />
          <span className={`w-6 h-1.5 rounded-sm ${step >= 2 ? "bg-[#ff8a4c]" : "bg-slate-200"}`} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">

        {/* ------------------------------------------------------------------ */}
        {/* STEP 1: Mode + Date + Time                                         */}
        {/* ------------------------------------------------------------------ */}
        {step === 1 && (
          <>
            {/* Booking Mode Selector (Instant ASAP vs Schedule) */}
            <div className="bg-white rounded-md border border-slate-200 p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Dispatch Mode
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-sm border ${
                  isFixedPrice
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-purple-50 text-purple-700 border-purple-200"
                }`}>
                  {isFixedPrice ? "Fixed Job Price" : "Hourly Rate Service"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setBookingMode("asap")}
                  className={`p-3.5 rounded-sm border text-left transition cursor-pointer flex items-start gap-3 ${
                    bookingMode === "asap"
                      ? "bg-[#fff4ed] border-[#ff8a4c] shadow-2xs ring-1 ring-[#ff8a4c]"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100/80"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 ${
                    bookingMode === "asap" ? "bg-[#ff8a4c] text-white" : "bg-slate-200 text-slate-600"
                  }`}>
                    <Zap size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">Reach ASAP</span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm border border-emerald-200">
                        <Zap size={10} className="fill-emerald-600 text-emerald-600" /> Instant
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      Technician dispatched immediately. Arrives within 30-45 mins.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setBookingMode("scheduled")}
                  className={`p-3.5 rounded-sm border text-left transition cursor-pointer flex items-start gap-3 ${
                    bookingMode === "scheduled"
                      ? "bg-[#fff4ed] border-[#ff8a4c] shadow-2xs ring-1 ring-[#ff8a4c]"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100/80"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 ${
                    bookingMode === "scheduled" ? "bg-[#ff8a4c] text-white" : "bg-slate-200 text-slate-600"
                  }`}>
                    <Calendar size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">Schedule for Later</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      Pick a specific date & time slot convenient for your schedule.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Instant Mode Notice */}
            {bookingMode === "asap" && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                  <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                  <span>Immediate Dispatch Activated</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Your technician will be notified right away. You can view live technician status and 6-digit start OTP on your customer profile.
                </p>
                <div className="pt-2 flex items-center justify-between text-xs font-semibold text-emerald-900 border-t border-emerald-200/60">
                  <span>Job Amount:</span>
                  <span className="text-sm font-extrabold text-[#ff8a4c]">₹{totalAmount} {isFixedPrice ? "(Fixed Job)" : "/ hr base"}</span>
                </div>
              </div>
            )}

            {/* Scheduled Mode Date & Time Pickers */}
            {bookingMode === "scheduled" && (
              <>
                {/* Date picker */}
                <div className="bg-white rounded-md border border-slate-200 p-4 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={15} className="text-[#ff8a4c]" />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Date</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {uniqueDates.map((date) => (
                      <button
                        key={date}
                        onClick={() => { setSelectedDate(date); setSelectedTime(""); }}
                        className={`py-2.5 text-center rounded-sm border text-xs font-medium transition cursor-pointer ${
                          selectedDate === date
                            ? "bg-[#ff8a4c] text-white border-[#ff8a4c] font-bold"
                            : "bg-white border-slate-200 text-slate-700 hover:border-[#ff8a4c]"
                        }`}
                      >
                        {formatDate(date)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time slot picker */}
                <div className="bg-white rounded-md border border-slate-200 p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Clock size={15} className="text-[#ff8a4c]" />
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Start Time</span>
                    </div>
                    {deadHours.length > 0 && !isDayOff && (
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-sm">
                        Technician Break Hours Masked
                      </span>
                    )}
                  </div>
                  {!selectedDate ? (
                    <p className="text-xs text-slate-400 py-4 text-center">Select a date first</p>
                  ) : slotsLoading ? (
                    <p className="text-xs text-slate-400 py-4 text-center">Checking availability…</p>
                  ) : isDayOff ? (
                    <div className="p-4 rounded-sm bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-amber-900">
                        <AlertCircle size={16} className="text-amber-600 shrink-0" />
                        <span>Technician Scheduled Day Off</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        This service partner is off on {dayOffName || "this day"} and not taking bookings. Please pick another date above to view open dispatch slots.
                      </p>
                    </div>
                  ) : timeSlotsForDate.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">No slots available for this day. Pick another day.</p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {timeSlotsForDate.map((slot) => {
                        const isBooked = bookedHours.includes(slot.time);
                        const isDead = deadHours.includes(slot.time);
                        const isBlockedByDuration = !isBooked && !isRangeAvailable(slot.time, duration);
                        const isUnavailable = isBooked || isBlockedByDuration;
                        const isSelected = selectedTime === slot.time;
                        return (
                          <button
                            key={slot.time}
                            onClick={() => !isUnavailable && setSelectedTime(slot.time)}
                            disabled={isUnavailable}
                            title={isDead ? "Technician scheduled break / off-hours" : isBooked ? "Already booked" : isBlockedByDuration ? "Not enough consecutive hours available" : ""}
                            className={`py-2.5 text-center rounded-sm border text-xs font-medium transition ${
                              isDead
                                ? "bg-amber-50/70 border-amber-200 text-amber-800 cursor-not-allowed"
                                : isBooked
                                ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through"
                                : isBlockedByDuration
                                ? "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed"
                                : isSelected
                                ? "bg-[#ff8a4c] text-white border-[#ff8a4c] font-bold cursor-pointer"
                                : "bg-white border-slate-200 text-slate-700 hover:border-[#ff8a4c] cursor-pointer"
                            }`}
                          >
                            {slot.time}
                            {isDead ? (
                              <span className="block text-[9px] font-bold text-amber-700 leading-tight">Break / Off</span>
                            ) : isBooked ? (
                              <span className="block text-[10px] leading-tight" style={{ textDecoration: "none" }}>Booked</span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Duration picker — shown for hourly services once start time is selected */}
                {selectedTime && !isFixedPrice && (
                  <div className="bg-white rounded-md border border-slate-200 p-4 shadow-2xs space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock size={15} className="text-[#ff8a4c]" />
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Estimated Duration</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {[1, 2, 3, 4].map((hrs) => {
                        const disabled = hrs > maxDuration || !isRangeAvailable(selectedTime, hrs);
                        return (
                          <button
                            key={hrs}
                            onClick={() => !disabled && setDuration(hrs)}
                            disabled={disabled}
                            className={`px-4 py-2 rounded-sm border text-xs font-bold transition ${
                              disabled
                                ? "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed"
                                : duration === hrs
                                ? "bg-[#ff8a4c] text-white border-[#ff8a4c] cursor-pointer"
                                : "bg-white border-slate-200 text-slate-700 hover:border-[#ff8a4c] cursor-pointer"
                            }`}
                          >
                            {hrs} hr{hrs > 1 ? "s" : ""}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-slate-500">
                      {selectedTime} – {endHour}
                      {totalAmount && <span className="ml-2 font-bold text-[#ff8a4c]">Total: ₹{totalAmount}</span>}
                    </p>
                  </div>
                )}
              </>
            )}

            {error && <p className="text-red-600 text-xs px-1 font-semibold">{error}</p>}

            <button
              onClick={handleNextStep}
              disabled={!canProceedToStep2}
              className="w-full py-3 bg-[#ff8a4c] hover:bg-[#f07432] text-white text-sm font-bold rounded-sm transition disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
            >
              Continue to Address <ArrowRight size={15} />
            </button>
          </>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STEP 2: Address + Booking Summary + Confirm                        */}
        {/* ------------------------------------------------------------------ */}
        {step === 2 && (
          <>
            {/* Summary card */}
            <div className="bg-white rounded-md border border-slate-200 p-4 shadow-2xs space-y-3">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Booking Summary</h2>
              <div className="divide-y divide-slate-100">
                <SummaryRow label="Service" value={subCategory?.label || serviceId} />
                <SummaryRow
                  label="Dispatch Mode"
                  value={
                    bookingMode === "asap" ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <Zap size={13} /> Reach ASAP (30-45 mins)
                      </span>
                    ) : (
                      "Scheduled Slot"
                    )
                  }
                />
                <SummaryRow
                  label="Date & Time"
                  value={
                    bookingMode === "asap"
                      ? `Today (${formatDate(todayStr)}) — Instant`
                      : `${formatDate(selectedDate)} (${selectedTime} – ${endHour})`
                  }
                />
                {!isFixedPrice && (
                  <SummaryRow label="Duration" value={`${duration} hr${duration > 1 ? "s" : ""}`} />
                )}
                <SummaryRow
                  label="Pricing Model"
                  value={isFixedPrice ? "Fixed Job Price (Flat)" : `₹${amount || 199}/hr (Hourly)`}
                />
                <SummaryRow
                  label="Total Amount"
                  value={`₹${totalAmount}`}
                  highlight
                />
                <SummaryRow label="Payment" value="Cash / Pay on Completion" />
              </div>
            </div>

            {/* Address Selection Card */}
            <div className="bg-white rounded-md border border-slate-200 p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-[#ff8a4c]" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Service Address
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff8a4c] hover:text-[#f07432] bg-[#fff4ed] hover:bg-[#ffe9dc] border border-orange-200 px-2.5 py-1.5 rounded-sm transition cursor-pointer"
                >
                  <LocateFixed size={13} />
                  <span>+ Add / GPS Auto-Detect</span>
                </button>
              </div>

              {/* Saved Address Cards */}
              {loadingAddresses ? (
                <div className="py-3 text-center text-xs text-slate-400">Loading saved addresses…</div>
              ) : savedAddresses.length > 0 ? (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Choose From Saved Addresses:
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {savedAddresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id && address === addr.full_address;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => {
                            setSelectedAddressId(addr.id);
                            setAddress(addr.full_address);
                          }}
                          className={`p-3 rounded-sm border transition cursor-pointer flex items-start justify-between gap-3 ${
                            isSelected
                              ? "bg-[#fff4ed]/60 border-[#ff8a4c] ring-1 ring-[#ff8a4c]"
                              : "bg-slate-50/50 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                                  isSelected
                                    ? "bg-[#ff8a4c] text-white"
                                    : "bg-slate-200 text-slate-700"
                                }`}
                              >
                                {addr.tag || "Home"}
                              </span>
                              {addr.is_default && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-sm border border-emerald-200">
                                  Default
                                </span>
                              )}
                              <span className="text-xs font-bold text-slate-900 truncate">
                                {addr.area || addr.city}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-snug">
                              {addr.full_address}
                            </p>
                          </div>

                          <div className="shrink-0 pt-0.5">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected
                                  ? "border-[#ff8a4c] bg-[#ff8a4c]"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {/* Editable / Custom Address box */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {savedAddresses.length > 0 ? "Selected Address / Custom Note:" : "Enter Full Address:"}
                  </label>
                  {selectedAddressId && (
                    <button
                      type="button"
                      onClick={() => setSelectedAddressId(null)}
                      className="text-[11px] text-[#ff8a4c] hover:underline font-semibold cursor-pointer"
                    >
                      Enter Custom
                    </button>
                  )}
                </div>

                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (selectedAddressId) setSelectedAddressId(null);
                  }}
                  placeholder="Flat / House No., Building, Street, Area / Locality, Landmark, City - Pincode"
                  className="w-full bg-white border border-slate-300 text-xs font-medium text-slate-900 rounded-sm px-3 py-2 focus:border-[#ff8a4c] outline-none leading-relaxed resize-none"
                />
              </div>

              <p className="text-[11px] text-slate-400 leading-normal">
                Specialists will navigate directly to this address. Use <strong>+ Add / GPS Auto-Detect</strong> to detect via GPS or save new locations.
              </p>
            </div>

            {error && <p className="text-red-600 text-xs px-1 font-semibold">{error}</p>}

            <button
              onClick={handleConfirm}
              disabled={loading || !canConfirm}
              className="w-full py-3 bg-[#ff8a4c] hover:bg-[#f07432] text-white text-sm font-bold rounded-sm transition disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                "Confirming..."
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Confirm & Dispatch Now — ₹{totalAmount}
                </>
              )}
            </button>
          </>
        )}

      </div>

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => {
          setIsLocationModalOpen(false);
          fetchAddresses();
        }}
        onSelectAddress={(fullAddr) => {
          setAddress(fullAddr);
          fetchAddresses();
        }}
      />
    </div>
  );
}

function SummaryRow({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-xs text-slate-500 font-medium">{label}</span>
      <span className={`text-xs font-bold ${highlight ? "text-[#ff8a4c]" : "text-slate-800"}`}>{value}</span>
    </div>
  );
}
