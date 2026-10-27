"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, Plus } from "lucide-react";
import BackHeader from "../components/BackHeader";
import BottomNav from "../../components/BottomNav";
import { API_BASE_URL, apiFetch } from "@/lib/api";

const CATEGORIES = [
  { id: "bookings", label: "Bookings" },
  { id: "refund", label: "Refund" },
  { id: "query", label: "Query" },
  { id: "payment", label: "Payment" },
  { id: "other", label: "Other" },
];

export default function HelpPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState("bookings");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch(`${API_BASE_URL}/support/my`);
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setError(data.detail || "Could not load tickets.");
      else setTickets(data.tickets || []);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (description.trim().length < 6) {
      setError("Please describe the issue (min 6 characters).");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await apiFetch(`${API_BASE_URL}/support/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, subject: subject.trim() || undefined, description: description.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.detail || "Could not raise ticket.");
        return;
      }
      setNotice(data.message || "Ticket raised. We will reach you in 24 hrs.");
      setShowForm(false);
      setSubject("");
      setDescription("");
      await load();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <BackHeader title="Support & Help Center" />
      <main className="max-w-2xl mx-auto p-4 space-y-4 pb-20">
        <div className="bg-white rounded-md border border-slate-200 p-4 shadow-2xs">
          <h1 className="text-sm font-bold text-slate-900">Customer support</h1>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            Issues related to bookings, refunds, payments and more. Raise a ticket — we will reach you in 24 hrs.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-3 w-full py-2.5 bg-[#ff8a4c] hover:bg-[#f07432] text-white text-xs font-bold rounded-sm transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Plus size={14} /> Raise a ticket
          </button>
        </div>

        {notice && (
          <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-sm px-3 py-2 flex items-center gap-2">
            <CheckCircle2 size={14} /> {notice}
          </p>
        )}
        {error && (
          <p className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-sm px-3 py-2 flex items-center gap-2">
            <AlertCircle size={14} /> {error}
          </p>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-10 gap-2 text-slate-500 text-xs font-semibold">
            <Loader2 size={15} className="animate-spin" /> Loading tickets…
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white rounded-md border border-slate-200 p-8 text-center space-y-2">
            <p className="text-sm font-bold text-slate-900">No tickets yet</p>
            <p className="text-xs text-slate-500">Raise your first ticket above and track replies here.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {tickets.map((t) => (
              <div key={t.id} className="bg-white rounded-md border border-slate-200 p-4 shadow-2xs space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-900">#{t.id} · {t.subject || t.category}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-sm border ${
                      t.status === "completed"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : t.status === "in_progress"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.category}</p>
                <p className="text-xs text-slate-700 leading-relaxed">{t.description}</p>
                {t.admin_reply && (
                  <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-sm p-2.5 leading-relaxed">
                    <span className="font-bold">Kazilen reply:</span> {t.admin_reply}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-md border border-slate-200 shadow-2xl p-5 max-w-md w-full space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Raise a ticket</h3>
            <form onSubmit={submit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Issue related to</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-9 bg-white border border-slate-300 text-sm font-medium text-slate-900 rounded-sm px-3"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Subject (optional)</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Refund for booking #12"
                  className="w-full h-9 bg-white border border-slate-300 text-sm font-medium text-slate-900 rounded-sm px-3 focus:outline-none focus:border-[#ff8a4c]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue with booking ID, amount, date…"
                  className="w-full bg-white border border-slate-300 text-xs font-medium text-slate-900 rounded-sm px-3 py-2 focus:border-[#ff8a4c] outline-none leading-relaxed resize-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-sm border border-slate-300 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 bg-[#ff8a4c] hover:bg-[#f07432] text-white text-xs font-bold rounded-sm transition disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? "Raising…" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
