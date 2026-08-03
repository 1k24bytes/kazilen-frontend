"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Clock, MapPin, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import servicesData from "../../data/services.json";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

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
  const amount = searchParams.get("amount");

  const subCategory = servicesData?.subCategories?.find((s) => s.id === serviceId);
  const allSlots = generateTimeSlots();

  // Step 1 state
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Step 2 state
  const [address, setAddress] = useState("");

  // UI state
  const [step, setStep] = useState(1); // 1 = date/time, 2 = address + confirm
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Unique dates for the date picker row
  const uniqueDates = [...new Set(allSlots.map((s) => s.date))];

  // Time slots for the selected date
  const timeSlotsForDate = allSlots.filter((s) => s.date === selectedDate);

  const canProceedToStep2 = selectedDate && selectedTime;
  const canConfirm = address.trim().length > 5;

  // ---------------------------------------------------------------------------
  // Step 1 → Step 2
  // ---------------------------------------------------------------------------
  const handleNextStep = () => {
    if (!canProceedToStep2) {
      setError("Please select a date and a time slot.");
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
      setError("Please enter a valid address.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${API}/bookings/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          worker_id: parseInt(workerId),
          service_id: serviceId,
          date: selectedDate,
          time_slot: `${selectedTime}-${timeSlotsForDate.find((s) => s.time === selectedTime)?.endTime || ""}`,
          address: address.trim(),
          amount: amount,
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
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => (step === 2 ? setStep(1) : router.back())}
          className="w-8 h-8 flex items-center justify-center rounded-sm bg-slate-100 hover:bg-slate-200 transition"
        >
          <ArrowLeft size={16} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-sm font-bold text-slate-900">
            {step === 1 ? "Select Date & Time" : "Confirm Booking"}
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
        {/* STEP 1: Date + Time                                                */}
        {/* ------------------------------------------------------------------ */}
        {step === 1 && (
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
                        ? "bg-[#ff8a4c] text-white border-[#ff8a4c]"
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
              <div className="flex items-center gap-2 mb-1">
                <Clock size={15} className="text-[#ff8a4c]" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Time Slot (1 hr)</span>
              </div>
              {!selectedDate ? (
                <p className="text-xs text-slate-400 py-4 text-center">Select a date first</p>
              ) : timeSlotsForDate.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No slots available for today. Pick another day.</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {timeSlotsForDate.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`py-2.5 text-center rounded-sm border text-xs font-medium transition cursor-pointer ${
                        selectedTime === slot.time
                          ? "bg-[#ff8a4c] text-white border-[#ff8a4c]"
                          : "bg-white border-slate-200 text-slate-700 hover:border-[#ff8a4c]"
                      }`}
                    >
                      {slot.time} – {slot.endTime}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {error && <p className="text-red-600 text-xs px-1">{error}</p>}

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
                <SummaryRow label="Date" value={formatDate(selectedDate)} />
                <SummaryRow label="Time" value={`${selectedTime} – ${timeSlotsForDate.find((s) => s.time === selectedTime)?.endTime}`} />
                <SummaryRow label="Rate" value={amount ? `₹${amount}` : "—"} highlight />
                <SummaryRow label="Payment" value="Cash / Offline after job" />
              </div>
            </div>

            {/* Address input */}
            <div className="bg-white rounded-md border border-slate-200 p-4 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-[#ff8a4c]" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Your Address</span>
              </div>
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Flat / House No., Street, Locality, City, Pincode"
                className="w-full bg-white border border-slate-300 text-sm font-medium text-slate-900 rounded-sm px-3 py-2.5 focus:border-[#ff8a4c] outline-none leading-relaxed resize-none"
              />
            </div>

            {error && <p className="text-red-600 text-xs px-1">{error}</p>}

            <button
              onClick={handleConfirm}
              disabled={loading || !canConfirm}
              className="w-full py-3 bg-[#ff8a4c] hover:bg-[#f07432] text-white text-sm font-bold rounded-sm transition disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                "Booking..."
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Confirm Booking{amount ? ` — ₹${amount}` : ""}
                </>
              )}
            </button>
          </>
        )}

      </div>
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
