"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck, Zap, Star, MapPin } from "lucide-react";
import BackHeader from "../components/BackHeader";
import BottomNav from "../../components/BottomNav";

export default function AboutPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <BackHeader title="About Kazilen" />
      <main className="max-w-2xl mx-auto p-4 space-y-4 pb-20">
        <div className="bg-white rounded-md border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#ff8a4c] text-white flex items-center justify-center font-bold">K</div>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight">Kazilen</h1>
              <p className="text-xs text-slate-500">Local services, verified partners</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Kazilen connects customers needing home and professional services with verified local workers and
            technicians. Browse services, book a specialist, track dispatch with secure in-portal OTPs, and rate
            your experience — all in one clean app.
          </p>
        </div>

        <div className="bg-white rounded-md border border-slate-200 p-5 shadow-2xs space-y-3">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">How it works</h2>
          <div className="space-y-2.5">
            {[
              { icon: <Zap size={15} className="text-[#ff8a4c]" />, t: "Book instantly or schedule", s: "Reach ASAP in 30–45 mins or pick a date and time slot." },
              { icon: <ShieldCheck size={15} className="text-emerald-600" />, t: "Secure OTP handover", s: "Share the 6-digit code from your portal with the technician." },
              { icon: <Star size={15} className="text-amber-500" />, t: "Rate and refer", s: "Review completed jobs and invite friends for rewards." },
              { icon: <MapPin size={15} className="text-slate-500" />, t: "Live marketplace", s: "Nearest-first verified partners in your area." },
            ].map((r, i) => (
              <div key={i} className="flex gap-3 bg-slate-50 border border-slate-200 rounded-sm p-3">
                <div className="shrink-0 mt-0.5">{r.icon}</div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{r.t}</p>
                  <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{r.s}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-md border border-slate-200 p-5 shadow-2xs space-y-2">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Support & policies</h2>
          <p className="text-xs text-slate-600 leading-relaxed">Support: support@kazilen.com · Help Center in Profile → Support & Help Center.</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">Terms, privacy and version info live with the admin panel. App version 1.0.0.</p>
          <button
            onClick={() => router.push("/profile/help")}
            className="w-full py-2.5 bg-[#ff8a4c] hover:bg-[#f07432] text-white text-xs font-bold rounded-sm transition cursor-pointer"
          >
            Contact Support
          </button>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
