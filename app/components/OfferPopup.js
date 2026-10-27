"use client";

import { useEffect, useState } from "react";
import { X, Tag } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OfferPopup() {
  const [popup, setPopup] = useState(null);
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let timer = null;
    let cancelled = false;
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    fetch(`${base}/popups/active`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.popup) return;
        const p = data.popup;
        try {
          if (sessionStorage.getItem(`kazilen_popup_${p.id}`) === "seen") return;
        } catch {}
        setPopup(p);
        const delay = Math.max(1, Math.min(60, p.delay_seconds || 5)) * 1000;
        timer = setTimeout(() => setVisible(true), delay);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (!popup || !visible) return null;

  const close = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(`kazilen_popup_${popup.id}`, "seen");
    } catch {}
  };

  const handleCta = () => {
    if (popup.discount_code) {
      try {
        sessionStorage.setItem("kazilen_popup_code", popup.discount_code);
      } catch {}
    }
    close();
    if (popup.cta_link) {
      if (popup.cta_link.startsWith("/")) router.push(popup.cta_link);
      else if (typeof window !== "undefined") window.open(popup.cta_link, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={close}>
      <div
        className="bg-white rounded-md border border-slate-200 shadow-2xl p-5 max-w-md w-full space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900">{popup.title}</h3>
          <button
            onClick={close}
            aria-label="Close offer"
            className="w-7 h-7 flex items-center justify-center rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer shrink-0"
          >
            <X size={14} />
          </button>
        </div>
        {popup.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={popup.image} alt={popup.title} className="w-full h-36 object-cover rounded-sm border border-slate-200" />
        )}
        {popup.description && <p className="text-xs text-slate-600 leading-relaxed">{popup.description}</p>}
        {popup.discount_code && (
          <p className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-sm px-3 py-2 flex items-center gap-2">
            <Tag size={13} /> Use code {popup.discount_code} at checkout
          </p>
        )}
        <div className="flex gap-2">
          {popup.cta_text && (
            <button
              onClick={handleCta}
              className="flex-1 py-2 bg-[#ff8a4c] hover:bg-[#f07432] text-white text-xs font-bold rounded-sm transition cursor-pointer"
            >
              {popup.cta_text}
            </button>
          )}
          <button
            onClick={close}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-sm border border-slate-300 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
