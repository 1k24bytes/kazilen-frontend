"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ClipboardList, Clock, CheckCircle2, Loader2, AlertCircle, ShieldCheck, Zap, User } from "lucide-react";
import Link from "next/link";
import { API_BASE_URL, apiFetch } from "@/lib/api";
import Header from "@/app/components/Header";
import BottomNav from "@/app/components/BottomNav";

const STATUS_CONFIG = {
  pending: { label: "Pending", className: "bg-slate-100 text-slate-600 border-slate-200" },
  accepted: { label: "Accepted", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  in_progress: { label: "In Progress", className: "bg-amber-50 text-amber-700 border-amber-200" },
  completed: { label: "Completed", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  cancelled: { label: "Cancelled", className: "bg-red-50 text-red-600 border-red-200" },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-sm border ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await apiFetch(`${API_BASE_URL}/bookings/my`, {
                  });
        if (res.ok) {
          const data = await res.json();
          setBookings(data.bookings || []);
        } else if (res.status === 401) {
          router.push("/login");
        } else {
          setError("Failed to load bookings.");
        }
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
    const interval = setInterval(fetchBookings, 4000);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />

      {/* Sub-header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.push("/profile")}
          className="w-8 h-8 flex items-center justify-center rounded-sm bg-slate-100 hover:bg-slate-200 transition"
        >
          <ChevronRight size={16} className="rotate-180 text-slate-600" />
        </button>
        <div>
          <h1 className="text-sm font-bold text-slate-900">My Bookings</h1>
          <p className="text-xs text-slate-500">All your service requests</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-3">

        {loading && (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading bookings…</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 rounded-md bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="text-center py-16 bg-white rounded-md border border-slate-200 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-sm bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <ClipboardList size={24} />
            </div>
            <p className="text-sm font-bold text-slate-900">No bookings yet</p>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Browse services on the home screen and book a technician.
            </p>
            <button
              onClick={() => router.push("/")}
              className="mx-auto mt-2 px-5 py-2 text-xs font-bold bg-[#ff8a4c] text-white rounded-sm hover:bg-[#f07432] transition"
            >
              Browse Services
            </button>
          </div>
        )}

        {!loading && bookings.map((booking) => {
          const hasStartOtp = booking.status === "accepted" && booking.start_otp;
          const hasEndOtp = booking.status === "in_progress" && booking.end_otp;
          const activeOtp = hasStartOtp ? booking.start_otp : hasEndOtp ? booking.end_otp : null;

          return (
            <Link key={booking.id} href={`/profile/orders/${booking.id}`}>
              <div className="bg-white rounded-md border border-slate-200 shadow-2xs p-4 hover:border-slate-300 transition cursor-pointer space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {booking.service_id?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                      <StatusBadge status={booking.status} />
                      {(booking.time_slot?.toUpperCase().includes("ASAP") || booking.time_slot?.toUpperCase().includes("INSTANT")) && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded-sm">
                          <Zap size={10} className="fill-amber-500 text-amber-600" /> Instant ASAP
                        </span>
                      )}
                    </div>
                    {booking.worker_name && (
                      <p className="text-xs text-slate-700 font-semibold flex items-center gap-1">
                        <User size={11} className="text-[#ff8a4c] shrink-0" />
                        <span>Partner: <span className="text-slate-900 font-bold">{booking.worker_name}</span></span>
                      </p>
                    )}
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock size={11} className="shrink-0" />
                      {booking.date} · {booking.time_slot}
                    </p>
                    {booking.address && (
                      <p className="text-xs text-slate-500 truncate">{booking.address}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {booking.amount && (
                      <span className="text-sm font-extrabold text-slate-900">₹{booking.amount}</span>
                    )}
                    <ChevronRight size={15} className="text-slate-400" />
                  </div>
                </div>

                {activeOtp && (
                  <div
                    className={`rounded-sm p-3 border flex items-center justify-between gap-3 ${
                      hasStartOtp
                        ? "bg-amber-50/80 border-amber-300 text-amber-900"
                        : "bg-emerald-50/80 border-emerald-300 text-emerald-900"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <ShieldCheck size={16} className={hasStartOtp ? "text-amber-600" : "text-emerald-600"} />
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold">
                          {hasStartOtp ? "Start OTP (Technician Arrived):" : "Completion OTP (Job Done):"}
                        </p>
                        <p className="text-[10px] text-slate-600 truncate">
                          Read this 6-digit code to technician
                        </p>
                      </div>
                    </div>
                    <div className="bg-white border border-slate-300 rounded-sm px-3 py-1 text-center shrink-0">
                      <span className="text-base font-mono font-extrabold tracking-[0.25em] text-slate-900">
                        {activeOtp}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Link>
          );
        })}

      </div>

      <BottomNav />
    </div>
  );
}
