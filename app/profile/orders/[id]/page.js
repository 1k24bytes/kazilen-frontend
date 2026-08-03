"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ChevronRight,
  Clock,
  MapPin,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ShieldCheck,
  User,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const STATUS_STEPS = ["pending", "accepted", "in_progress", "completed"];

const STATUS_CONFIG = {
  pending: { label: "Pending Acceptance", color: "text-slate-600", bg: "bg-slate-100 border-slate-200" },
  accepted: { label: "Worker Accepted", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  in_progress: { label: "Job In Progress", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  completed: { label: "Completed", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  cancelled: { label: "Cancelled", color: "text-red-600", bg: "bg-red-50 border-red-200" },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-[11px] font-bold rounded-sm border ${cfg.bg} ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="mt-0.5 text-slate-400 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-slate-900 mt-0.5">{value || "—"}</p>
      </div>
    </div>
  );
}

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params?.id;

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBooking = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.push("/login"); return; }
    try {
      const res = await fetch(`${API}/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBooking(data);
      } else if (res.status === 401) {
        router.push("/login");
      } else {
        setError("Could not load booking details.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId) fetchBooking();
  }, [bookingId]);

  // Auto-refresh every 10s when job is in flight
  useEffect(() => {
    if (!booking) return;
    if (["pending", "accepted", "in_progress"].includes(booking.status)) {
      const t = setInterval(fetchBooking, 10000);
      return () => clearInterval(t);
    }
  }, [booking?.status]);

  const serviceLabel = booking?.service_id
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const currentStep = STATUS_STEPS.indexOf(booking?.status);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.push("/profile/orders")}
          className="w-8 h-8 flex items-center justify-center rounded-sm bg-slate-100 hover:bg-slate-200 transition"
        >
          <ChevronRight size={16} className="rotate-180 text-slate-600" />
        </button>
        <div>
          <h1 className="text-sm font-bold text-slate-900">Booking #{bookingId}</h1>
          <p className="text-xs text-slate-500">Service booking detail</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">

        {loading && (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading…</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 rounded-md bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        {booking && (
          <>
            {/* Status Banner */}
            <div className="bg-white rounded-md border border-slate-200 shadow-2xs p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Current Status</p>
                <StatusBadge status={booking.status} />
              </div>
              {booking.amount && (
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rate</p>
                  <p className="text-lg font-extrabold text-slate-900">₹{booking.amount}</p>
                </div>
              )}
            </div>

            {/* Progress Timeline */}
            <div className="bg-white rounded-md border border-slate-200 shadow-2xs p-4">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Progress</p>
              <div className="flex items-center gap-0">
                {STATUS_STEPS.map((s, i) => {
                  const done = i <= currentStep;
                  const cfg = STATUS_CONFIG[s];
                  return (
                    <div key={s} className="flex items-center flex-1 min-w-0">
                      <div className="flex flex-col items-center gap-1 flex-1">
                        <div className={`w-6 h-6 rounded-sm border flex items-center justify-center ${done ? "bg-[#ff8a4c] border-[#ff8a4c]" : "bg-slate-100 border-slate-200"}`}>
                          {done
                            ? <CheckCircle2 size={13} className="text-white" />
                            : <span className="text-[10px] font-bold text-slate-400">{i + 1}</span>
                          }
                        </div>
                        <span className={`text-[9px] font-semibold text-center leading-tight ${done ? "text-[#ff8a4c]" : "text-slate-400"}`}>
                          {s === "pending" ? "Booked" : s === "accepted" ? "Accepted" : s === "in_progress" ? "Started" : "Done"}
                        </span>
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div className={`h-0.5 flex-1 mx-1 ${i < currentStep ? "bg-[#ff8a4c]" : "bg-slate-200"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* OTP Info — shown when worker has started the job */}
            {booking.status === "in_progress" && booking.start_otp && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-amber-600" />
                  <p className="text-xs font-bold text-amber-800">Job In Progress — Start OTP</p>
                </div>
                <p className="text-3xl font-mono font-extrabold tracking-[0.3em] text-amber-900">{booking.start_otp}</p>
                <p className="text-xs text-amber-700">This OTP was used to confirm job start. Keep it for your records.</p>
              </div>
            )}

            {/* Booking Details */}
            <div className="bg-white rounded-md border border-slate-200 shadow-2xs p-4">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Details</p>
              <InfoRow icon={<User size={15} />} label="Service" value={serviceLabel} />
              <InfoRow icon={<Clock size={15} />} label="Date & Time" value={`${booking.date} · ${booking.time_slot}`} />
              <InfoRow icon={<MapPin size={15} />} label="Address" value={booking.address} />
            </div>

            {/* Completion message */}
            {booking.status === "completed" && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4 flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-emerald-800">Job Completed</p>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Your service has been completed successfully. Please pay the worker offline.
                  </p>
                </div>
              </div>
            )}

            {/* Pending hint */}
            {booking.status === "pending" && (
              <div className="bg-slate-50 border border-slate-200 rounded-md p-4 text-xs text-slate-500 leading-relaxed">
                Your booking has been received. A worker will accept it shortly and you'll see the status update here automatically.
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
