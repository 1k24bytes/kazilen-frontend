"use client";

import { useState, Suspense } from "react";
import { ArrowLeft, User, CheckCircle2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

function CreateAccountClient() {
  const router = useRouter();
  const params = useSearchParams();
  const phoneFromQuery = params.get("phone");

  const [phoneNo] = useState(phoneFromQuery || "");
  const [name, setName] = useState("");
  const [touched, setTouched] = useState({ name: false });
  const [loading, setLoading] = useState(false);

  const canSubmit = name.trim().length > 0 && /^\d{10}$/.test(phoneNo);

  const handleCreateAccount = async () => {
    if (!canSubmit) {
      setTouched({ name: true });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        phone_number: `91${phoneNo}`,
        full_name: name.trim(),
        role: "customer",
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Registration failed");
        return;
      }

      if (data.status === "success" && data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        alert("Account created successfully!");
        router.replace("/");
      }
    } catch (err) {
      alert(`Create failed: ${err?.message || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-xl space-y-6">
        
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-600 transition cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Create Kazilen Profile</h1>
            <p className="text-xs text-slate-500">Provide your full name to set up your account</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Verified Mobile Number
            </label>
            <div className="flex items-center bg-slate-100/80 border border-slate-200 rounded-xl px-4 py-3 cursor-not-allowed">
              <span className="text-slate-500 text-sm font-semibold mr-2">+91</span>
              <input
                type="tel"
                value={phoneNo}
                readOnly
                className="w-full bg-transparent text-slate-700 text-sm font-semibold focus:outline-none cursor-not-allowed"
              />
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                placeholder="e.g. Rahul Sharma"
                className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm font-semibold text-slate-900 focus:outline-none transition ${
                  touched.name && !name.trim()
                    ? "border-red-400 focus:ring-2 focus:ring-red-400/20"
                    : "border-slate-300 focus:border-[#ff8a4c] focus:ring-2 focus:ring-[#ff8a4c]/20"
                }`}
              />
            </div>
            {touched.name && !name.trim() && (
              <p className="text-xs text-red-500 mt-1.5 font-medium">Full name is required</p>
            )}
          </div>

          <button
            onClick={handleCreateAccount}
            disabled={!canSubmit || loading}
            className={`w-full font-bold py-3.5 rounded-xl text-sm shadow-md transition cursor-pointer ${
              !canSubmit || loading
                ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                : "bg-[#ff8a4c] hover:bg-[#f07432] text-white shadow-orange-500/20 active:scale-98"
            }`}
          >
            {loading ? "Creating Account..." : "Complete & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CreateAccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-sm">Loading registration…</div>}>
      <CreateAccountClient />
    </Suspense>
  );
}
