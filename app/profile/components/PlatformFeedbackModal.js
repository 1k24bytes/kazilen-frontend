"use client";

import { useState } from "react";
import { Loader2, Star, X, Check, ShieldCheck } from "lucide-react";
import { API_BASE_URL, apiFetch } from "@/lib/api";

const RATING_OPTIONS = [1, 2, 3, 4, 5];

export default function PlatformFeedbackModal({ initialFeedback, onClose, onSaved }) {
  const [rating, setRating] = useState(initialFeedback?.rating || 5);
  const [description, setDescription] = useState(initialFeedback?.description || "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!rating) {
      setError("Please select a star rating.");
      return;
    }
    if (!description.trim()) {
      setError("Please add a short note about your experience.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const res = await apiFetch(`${API_BASE_URL}/reviews/platform`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, description: description.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Could not save platform feedback.");
        return;
      }

      setSuccess(true);
      if (onSaved) {
        onSaved({
          id: data.id,
          rating,
          description: description.trim(),
          created_at: data.created_at || new Date().toISOString(),
        });
      }
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-md rounded-md border border-slate-200 bg-white p-5 shadow-2xl space-y-4">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-700 px-2 py-0.5 rounded-sm border border-orange-200">
                Kazilen Experience
              </span>
            </div>
            <h2 className="mt-1.5 text-base font-bold tracking-tight text-slate-900">
              {initialFeedback ? "Your Kazilen Platform Rating" : "Rate the Kazilen Platform"}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Share your overall experience with the Kazilen marketplace & service platform.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-sm p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
          >
            <X size={17} />
          </button>
        </div>

        {success && (
          <div className="p-3 rounded-sm bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <Check size={16} className="text-emerald-600 shrink-0" />
            <span>Thank you! Your feedback has been saved.</span>
          </div>
        )}

        {/* Star Rating Picker */}
        <div className="py-2 text-center space-y-2">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Overall Platform Rating
          </p>
          <div className="flex justify-center gap-2" role="radiogroup" aria-label="Platform Rating">
            {RATING_OPTIONS.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setRating(val)}
                aria-label={`${val} star${val === 1 ? "" : "s"}`}
                aria-pressed={rating === val}
                className={`rounded-sm border p-2 transition-colors cursor-pointer ${
                  rating >= val
                    ? "border-amber-300 bg-amber-50 text-amber-600 shadow-2xs"
                    : "border-slate-200 bg-white text-slate-300 hover:border-slate-300"
                }`}
              >
                <Star size={22} fill="currentColor" />
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            {rating === 5 && "⭐ Excellent - Seamless experience!"}
            {rating === 4 && "⭐ Good - Satisfied with platform."}
            {rating === 3 && "⭐ Average - Needs some improvements."}
            {rating === 2 && "⭐ Poor - Encountered difficulties."}
            {rating === 1 && "⭐ Bad - Disappointed with platform."}
          </p>
        </div>

        {/* Description Textarea */}
        <div className="space-y-1.5">
          <label htmlFor="platform-feedback-desc" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Your Feedback & Suggestions
          </label>
          <textarea
            id="platform-feedback-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
            rows={4}
            placeholder="Tell us what you loved or how we can make Kazilen better for you..."
            className="w-full resize-none rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#ff8a4c] focus:ring-1 focus:ring-[#ff8a4c] transition"
          />
          {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        </div>

        {/* Actions */}
        <div className="pt-2 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-sm border border-slate-300 bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving || success}
            className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-[#ff8a4c] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#f07432] disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            <span>{initialFeedback ? "Update Feedback" : "Submit Feedback"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
