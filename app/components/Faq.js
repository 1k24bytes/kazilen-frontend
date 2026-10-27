"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Faq({ items }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="divide-y divide-slate-100 rounded-md border border-slate-200 bg-white shadow-2xs">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              id={`faq-button-${i}`}
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-4 text-left transition-colors duration-150 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ff8a4c] sm:px-5"
            >
              <span className="text-sm font-bold text-slate-900 text-balance">{item.q}</span>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? "border-[#ff8a4c] bg-[#ff8a4c] text-white" : "border-slate-200 bg-slate-50 text-slate-500"}`}
              >
                <ChevronDown size={15} className={`transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
              </span>
            </button>
            <div id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-button-${i}`} hidden={!isOpen}>
              <p className="text-pretty px-4 pb-4 text-sm leading-relaxed text-slate-600 sm:px-5">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
