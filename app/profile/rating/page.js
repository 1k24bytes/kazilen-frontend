"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Edit3, Loader2, Star } from "lucide-react";

import { API_BASE_URL, apiFetch } from "@/lib/api";
import servicesConfig from "@/app/data/services.json";
import BackHeader from "@/app/profile/components/BackHeader";
import BottomNav from "@/app/components/BottomNav";

function getServiceLabel(serviceId) {
  const service = servicesConfig.subCategories.find((item) => item.id === serviceId);
  return service?.label || serviceId?.replace(/-/g, " ").replace(/\b\w/g, (character) => character.toUpperCase()) || "Service";
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
}

function RatingStars({ rating, interactive = false, onSelect }) {
  return (
    <div className="flex items-center gap-1" role={interactive ? "radiogroup" : undefined} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type={interactive ? "button" : undefined}
          onClick={interactive ? () => onSelect(value) : undefined}
          disabled={!interactive}
          aria-label={`${value} star${value === 1 ? "" : "s"}`}
          aria-pressed={interactive ? rating === value : undefined}
          className={`rounded-sm p-1 ${interactive ? "hover:bg-amber-50" : "cursor-default"} ${rating >= value ? "text-amber-500" : "text-slate-300"}`}
        >
          <Star size={interactive ? 20 : 15} fill="currentColor" />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ item, now, onEdit }) {
  const canEdit = item.editable && now > 0 && new Date(item.editable_until).getTime() > now;
  return (
    <article className="rounded-md border border-slate-200 bg-white p-4 shadow-2xs">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900">
            Review for {item.reviewee_name}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {getServiceLabel(item.service_id)} · Booking #{item.booking_id}
          </p>
        </div>
        {canEdit && (
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-200"
          >
            <Edit3 size={13} />
            Edit
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <RatingStars rating={item.rating} />
        {!canEdit && <span className="text-[10px] font-semibold text-slate-400">Editing closed</span>}
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{item.description}</p>
      <p className="mt-3 text-[10px] text-slate-400">Submitted {formatDate(item.created_at)}</p>
    </article>
  );
}

function EditReviewModal({ item, onClose, onSaved }) {
  const [rating, setRating] = useState(item.rating);
  const [description, setDescription] = useState(item.description);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    if (!rating) {
      setError("Please select a rating.");
      return;
    }
    if (!description.trim()) {
      setError("Please add a description.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const response = await apiFetch(`${API_BASE_URL}/reviews/participant/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, description: description.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.detail || "Could not update the review.");
        return;
      }
      onSaved({ ...item, rating, description: description.trim(), created_at: data.created_at });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-md rounded-md border border-slate-200 bg-white p-5 shadow-2xl">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Edit within 15 minutes</p>
        <h2 className="mt-1 text-base font-bold tracking-tight text-slate-900">
          Edit review for {item.reviewee_name}
        </h2>

        <div className="mt-4 flex justify-center">
          <RatingStars rating={rating} interactive onSelect={setRating} />
        </div>

        <label htmlFor="edit-review-description" className="mt-4 block text-xs font-bold text-slate-700">
          Description
        </label>
        <textarea
          id="edit-review-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={2000}
          rows={4}
          className="mt-2 w-full resize-none rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#ff8a4c]"
        />
        {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-sm border border-slate-300 bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-[#ff8a4c] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#f07432] disabled:opacity-50"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RatingPage() {
  const router = useRouter();
  const [history, setHistory] = useState({ reviews: [], platform_feedback: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const initialClock = setTimeout(() => setNow(Date.now()), 0);
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => {
      clearTimeout(initialClock);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await apiFetch(`${API_BASE_URL}/reviews/my`, {
                  });
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        const data = await response.json();
        if (!response.ok) {
          setError(data.detail || "Could not load your reviews.");
          return;
        }
        setHistory({ reviews: data.reviews || [], platform_feedback: data.platform_feedback || [] });
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [router]);

  const saveEditedReview = (updated) => {
    setHistory((current) => ({
      ...current,
      reviews: current.reviews.map((item) => item.id === updated.id ? updated : item),
    }));
    setEditing(null);
  };

  const hasHistory = history.reviews.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <BackHeader title="Ratings & Reviews" />
      <main className="mx-auto max-w-3xl space-y-5 px-4 py-6 sm:px-6">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">Your submitted reviews</h1>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Edit a worker review only within 15 minutes of submitting it.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-400">
            <Loader2 size={18} className="animate-spin" />
            Loading reviews...
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-600">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        {!loading && !error && !hasHistory && (
          <div className="rounded-md border border-slate-200 bg-white p-8 text-center shadow-2xs">
            <Star size={24} className="mx-auto text-slate-300" />
            <p className="mt-3 text-sm font-bold text-slate-900">No reviews yet</p>
            <p className="mt-1 text-xs text-slate-500">Your completed-job reviews will appear here.</p>
          </div>
        )}

        {!loading && !error && hasHistory && (
          <div className="space-y-5">
            {history.reviews.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Worker reviews</h2>
                {history.reviews.map((item) => (
                  <ReviewCard key={`participant-${item.id}`} item={item} now={now} onEdit={(review) => setEditing({ item: review })} />
                ))}
              </section>
            )}
          </div>
        )}
      </main>

      {editing && (
        <EditReviewModal
          item={editing.item}
          onClose={() => setEditing(null)}
          onSaved={saveEditedReview}
        />
      )}

      <BottomNav />
    </div>
  );
}
