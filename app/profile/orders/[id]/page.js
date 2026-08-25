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
  Copy,
  Check,
  Zap,
} from "lucide-react";
import { API_BASE_URL, apiFetch } from "@/lib/api";
import CompletionReviewModal from "@/app/components/CompletionReviewModal";
import BottomNav from "@/app/components/BottomNav";

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
  const [reviewStatus, setReviewStatus] = useState(null);
  const [reviewClosed, setReviewClosed] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);

  const handleCopyOtp = async (otp) => {
    if (!otp) return;
    await navigator.clipboard.writeText(otp);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const fetchBooking = async () => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/bookings/${bookingId}`, {
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

  useEffect(() => {
    if (!bookingId || booking?.status !== "completed") return;
    apiFetch(`${API_BASE_URL}/reviews/bookings/${bookingId}/status`, {
          })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => data && setReviewStatus(data))
      .catch(() => {});
  }, [bookingId, booking?.status]);

  // Auto-refresh every 10s when job is in flight
  useEffect(() => {
    if (!booking) return;
    if (["pending", "accepted", "in_progress"].includes(booking.status)) {
      const t = setInterval(fetchBooking, 5000);
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
                {booking.worker_name && (
                  <p className="text-xs text-slate-700 font-semibold mt-2 flex items-center gap-1.5">
                    <User size={13} className="text-[#ff8a4c] shrink-0" />
                    <span>Assigned Specialist: <span className="text-slate-900 font-bold">{booking.worker_name}</span></span>
                  </p>
                )}
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

            {/* OTP Banner — shown to customer when worker has generated it */}
            {booking.status === 'accepted' && booking.start_otp && (
              <div className="bg-amber-50 border border-amber-300 rounded-md p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-amber-600" />
                    <p className="text-sm font-bold text-amber-900">Technician has arrived!</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-sm border border-amber-300">
                    Start Code
                  </span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Read this 6-digit code to the technician to authorize and start the job:
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white border border-amber-300 rounded-sm py-3 px-4 text-center">
                    <p className="text-3xl sm:text-4xl font-mono font-black tracking-[0.35em] text-amber-900 select-all">
                      {booking.start_otp}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyOtp(booking.start_otp)}
                    className="p-3 bg-white border border-amber-300 rounded-sm hover:bg-amber-100 text-amber-900 transition flex items-center justify-center shrink-0"
                    title="Copy OTP"
                  >
                    {copiedOtp ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
                  </button>
                </div>
                <p className="text-[11px] text-amber-700">
                  Secure in-portal verification. Do not share this code with anyone else.
                </p>
              </div>
            )}

            {booking.status === 'in_progress' && booking.end_otp && (
              <div className="bg-emerald-50 border border-emerald-300 rounded-md p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-600" />
                    <p className="text-sm font-bold text-emerald-900">Job completion verification</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-sm border border-emerald-300">
                    Completion Code
                  </span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Read this 6-digit code to the technician to confirm job completion:
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white border border-emerald-300 rounded-sm py-3 px-4 text-center">
                    <p className="text-3xl sm:text-4xl font-mono font-black tracking-[0.35em] text-emerald-900 select-all">
                      {booking.end_otp}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyOtp(booking.end_otp)}
                    className="p-3 bg-white border border-emerald-300 rounded-sm hover:bg-emerald-100 text-emerald-900 transition flex items-center justify-center shrink-0"
                    title="Copy OTP"
                  >
                    {copiedOtp ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
                  </button>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Secure in-portal verification. Do not share this code with anyone else.
                </p>
              </div>
            )}

            {/* Booking Details */}
            <div className="bg-white rounded-md border border-slate-200 shadow-2xs p-4">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Details</p>
              <InfoRow icon={<User size={15} />} label="Service" value={serviceLabel} />
              {booking.worker_name && (
                <InfoRow icon={<User size={15} className="text-[#ff8a4c]" />} label="Assigned Specialist" value={booking.worker_name} />
              )}
              {(booking.time_slot?.toUpperCase().includes("ASAP") || booking.time_slot?.toUpperCase().includes("INSTANT")) && (
                <InfoRow
                  icon={<Zap size={15} className="text-amber-600" />}
                  label="Dispatch Mode"
                  value="Instant ASAP (Arrive in 30-45 mins)"
                />
              )}
              <InfoRow icon={<Clock size={15} />} label="Date & Time" value={`${booking.date} · ${booking.time_slot}`} />
              {booking.amount && (
                <InfoRow icon={<CheckCircle2 size={15} />} label="Total Amount" value={`₹${booking.amount}`} />
              )}
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

            {booking.status === "completed" && reviewStatus && !reviewClosed &&
              !reviewStatus.participant_review_submitted && (
                <CompletionReviewModal
                  bookingId={bookingId}
                  onComplete={() => setReviewClosed(true)}
                />
              )}

            {/* Pending hint */}
            {booking.status === "pending" && (
              <div className="bg-slate-50 border border-slate-200 rounded-md p-4 text-xs text-slate-500 leading-relaxed">
                Your booking has been received. A worker will accept it shortly and you&apos;ll see the status update here automatically.
              </div>
            )}
          </>
        )}

      </div>

      <BottomNav />
    </div>
  );
}
