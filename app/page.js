"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Zap,
  Gift,
  Tag,
  ShieldCheck,
  Star,
  MapPin,
  BadgeCheck,
  Wallet,
  CalendarCheck,
  ChevronRight,
  Wrench,
} from "lucide-react";
import ServiceBrowser from "./components/ServiceBrowser";
import ProfessionalCard from "./components/ProfessionalCard";
import ProfessionalCardSkeleton from "./components/skeletons/ProfessionalCardSkeleton";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import Footer from "./components/Footer";
import OfferPopup from "./components/OfferPopup";
import Faq from "./components/Faq";
import { API_BASE_URL, apiFetch } from "@/lib/api";

const FAQS = [
  {
    q: "How do I know the price before booking?",
    a: "Every service shows an upfront rate on its card, set from the admin catalog or the technician’s approved rate. You confirm the exact total, including any platform fee and discounts, on the Schedule screen before dispatch.",
  },
  {
    q: "Are technicians background verified?",
    a: "Yes. Workers join only after admin review, and every profile shows a Verified badge, live rating and completed job count. Open any profile to read past customer reviews before booking.",
  },
  {
    q: "How fast can someone reach me?",
    a: "Choose Reach ASAP for dispatch in 30 to 45 minutes, or pick Schedule for Later to reserve a date and time slot. Live 6 digit OTPs in your portal confirm start and completion.",
  },
  {
    q: "How do payments work?",
    a: "Pay cash after the job or pay online securely with UPI and cards. Online bookings show a full breakup of service amount, platform fee and total before you pay, and receipts stay in My Bookings.",
  },
  {
    q: "What is the platform fee?",
    a: "A small fee set by the Kazilen admin keeps verification, support and payments running. It is always shown separately in your total before you confirm, for both cash and online bookings.",
  },
  {
    q: "Can I reschedule or cancel a booking?",
    a: "Yes, from My Bookings before the technician starts the job. If a specialist is offline or fully booked, pick another verified partner or a different time slot.",
  },
  {
    q: "What if I am not happy with the work?",
    a: "Rate every completed job and raise a ticket from Support and Help Center under Bookings, Refund or Query. The team replies within 24 hours and arranges a revisit or refund where due.",
  },
  {
    q: "Which areas do you cover?",
    a: "We cover all major localities with nearest first sorting when you share your location. New areas open every month.",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Deshmukh",
    area: "Green Park",
    service: "Fan repair · ₹199",
    text: "Booked at 6:40 pm, technician arrived by 7:15 with the capacitor in hand. The OTP handover made the whole visit feel safe and tracked.",
    rating: 5,
  },
  {
    name: "Rahul Agrawal",
    area: "Model Town",
    service: "Home wiring · ₹349",
    text: "Upfront rate matched the final bill to the rupee. The schedule picker blocked the technician’s lunch break automatically, so no back and forth on timing.",
    rating: 5,
  },
  {
    name: "Sneha Kulkarni",
    area: "Lakeview Colony",
    service: "Deep cleaning · ₹1,499",
    text: "First booking needed one callback for a missed corner and support arranged a free revisit the next morning. That is why I rebooked twice since.",
    rating: 4,
  },
];

const HERO_IMAGES = [
  { src: "/subcategories/fan-installation.webp", alt: "Technician installing a ceiling fan" },
  { src: "/subcategories/consultation.webp", alt: "Electrician inspecting a switchboard" },
  { src: "/subcategories/book-by-hour.webp", alt: "Technician at work on a home repair" },
  { src: "/subcategories/fan-repair.webp", alt: "Fan motor repair in progress" },
];

const fmtInt = new Intl.NumberFormat("en-IN");

export default function HomePage() {
  const router = useRouter();
  const [category, setCategory] = useState("Electrician");
  const [subCategory, setSubCategory] = useState("consult");
  const [catalog, setCatalog] = useState({ categories: [], subCategories: [] });
  const [offers, setOffers] = useState([]);

  const [workers, setWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [query, setQuery] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const searchBoxRef = useRef(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const c = params.get("category");
      const s = params.get("service");
      if (c) setCategory(c);
      if (s) setSubCategory(s);
    } catch {}
  }, []);

  useEffect(() => {
    let active = true;
    import("@/lib/catalog").then(({ fetchCatalog }) =>
      fetchCatalog().then((data) => {
        if (!active) return;
        setCatalog(data);
        if (data.categories?.length && !data.categories.some((c) => c.id === category || c.name === category)) {
          const first = data.categories[0];
          setCategory(first.id || first.name);
          setSubCategory("");
        }
      })
    );
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function fetchWorkers() {
      if (!subCategory) {
        setWorkers([]);
        return;
      }
      setIsLoading(true);
      setLoadError("");
      try {
        let coordsSuffix = "";
        try {
          const saved = JSON.parse(localStorage.getItem("user_location_coords") || "null");
          const lat = parseFloat(saved?.latitude);
          const lng = parseFloat(saved?.longitude);
          if (Number.isFinite(lat) && Number.isFinite(lng)) {
            coordsSuffix = `&lat=${lat}&lng=${lng}`;
          }
        } catch {
          // no saved GPS coords — marketplace returns default order
        }
        const response = await apiFetch(
          `${API_BASE_URL}/workers?sub_category=${encodeURIComponent(subCategory)}${coordsSuffix}`
        );
        if (response.ok) {
          const data = await response.json();
          setWorkers(data.workers || data || []);
        } else {
          setWorkers([]);
          setLoadError("Could not load professionals. Check your connection and try again.");
        }
      } catch {
        setWorkers([]);
        setLoadError("Could not load professionals. Check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchWorkers();
  }, [subCategory]);

  useEffect(() => {
    let active = true;
    apiFetch(`${API_BASE_URL}/offers`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && data?.offers) setOffers(data.offers);
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const allSubs = useMemo(() => catalog.subCategories || [], [catalog]);

  const tradeCounts = useMemo(() => {
    const byCat = {}
    for (const s of allSubs) {
      const id = s.categoryId || s.category_id
      if (id) byCat[id] = (byCat[id] || 0) + 1
    }
    return byCat
  }, [allSubs]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return allSubs
      .filter(
        (s) =>
          s.label?.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q) ||
          s.id?.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [query, allSubs]);

  const pickService = (sub) => {
    const catId = sub.categoryId || sub.category_id || category;
    const cat = (catalog.categories || []).find((c) => c.id === catId || c.name === catId);
    setCategory(cat ? cat.id || cat.name : catId);
    setSubCategory(sub.id);
    setQuery("");
    setSearchFocus(false);
    try {
      const params = new URLSearchParams(window.location.search);
      params.set("category", cat ? cat.id || cat.name : catId);
      params.set("service", sub.id);
      router.replace(`/?${params.toString()}`, { scroll: false });
    } catch {}
    document.getElementById("professionals")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const syncCategory = (val) => {
    setCategory(val);
    setSubCategory("");
    try {
      const params = new URLSearchParams(window.location.search);
      params.set("category", val);
      params.delete("service");
      router.replace(`/?${params.toString()}`, { scroll: false });
    } catch {}
  };

  const syncSub = (val) => {
    setSubCategory(val);
    try {
      const params = new URLSearchParams(window.location.search);
      params.set("category", category);
      params.set("service", val);
      router.replace(`/?${params.toString()}`, { scroll: false });
    } catch {}
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        Skip to main content
      </a>
      <Header />

      <main id="main" className="flex-1 bg-slate-50 pb-16">
        {/* Hero */}
        <section aria-labelledby="hero-heading" className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 pb-10 pt-8 sm:px-6 sm:pt-12 lg:grid-cols-2 lg:items-center lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#ff8a4c]">
                <span translate="no">Kazilen</span>
              </p>
              <h1
                id="hero-heading"
                className="mt-3 max-w-[680px] text-balance text-4xl font-bold leading-[40px] tracking-tight text-slate-900 sm:text-5xl sm:leading-none"
              >
                Home services at your doorstep
              </h1>
              <p className="mt-4 max-w-[680px] text-pretty text-base leading-6 text-slate-600">
                Verified electricians, plumbers, AC technicians and carpenters. Upfront rates, OTP secured visits and ratings you can trust.
              </p>

              <div ref={searchBoxRef} className="relative mt-6 max-w-[680px]">
                <label htmlFor="service-search" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  What do you need fixed today?
                </label>
                <div className="flex items-center gap-2 rounded-md border border-slate-300 bg-white p-1.5 shadow-2xs transition-colors duration-150 focus-within:border-[#ff8a4c]">
                  <Search size={18} className="ml-2 shrink-0 text-slate-400" aria-hidden="true" />
                  <input
                    id="service-search"
                    name="service-search"
                    type="search"
                    autoComplete="off"
                    spellCheck={false}
                    inputMode="search"
                    placeholder="Try fan repair, deep cleaning…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setSearchFocus(true)}
                    onBlur={() => window.setTimeout(() => setSearchFocus(false), 150)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchResults.length > 0) pickService(searchResults[0]);
                      if (e.key === "Escape") setQuery("");
                    }}
                    aria-expanded={searchFocus && searchResults.length > 0}
                    aria-controls="search-results"
                    aria-autocomplete="list"
                    role="combobox"
                    className="h-10 w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => searchResults.length > 0 && pickService(searchResults[0])}
                    className="shrink-0 rounded-sm bg-[#ff8a4c] px-4 py-2 text-base font-semibold text-white transition-colors duration-150 hover:bg-[#f07432] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8a4c] focus-visible:ring-offset-2"
                  >
                    Search
                  </button>
                </div>
                {searchFocus && searchResults.length > 0 && (
                  <ul
                    id="search-results"
                    role="listbox"
                    aria-label="Matching services"
                    className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-md border border-slate-200 bg-white shadow-2xl"
                  >
                    {searchResults.map((s) => (
                      <li key={s.id} role="option" aria-selected="false">
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => pickService(s)}
                          className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ff8a4c]"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-bold text-slate-900">{s.label}</span>
                            <span className="block truncate text-xs text-slate-500">
                              {(s.default_fixed_price ?? s.fixed_price) ? `from ₹${fmtInt.format(Number(s.default_fixed_price ?? s.fixed_price))} · ` : ""}
                              {s.description || ""}
                            </span>
                          </span>
                          <ChevronRight size={15} className="shrink-0 text-slate-400" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-slate-500">Popular:</span>
                {["Fan repair", "Deep cleaning", "AC service", "Plumber"].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setQuery(term);
                      document.getElementById("service-search")?.focus();
                    }}
                    className="cursor-pointer rounded-sm border border-slate-200 bg-white px-2.5 py-1 font-semibold text-slate-600 transition-colors duration-150 hover:border-[#ff8a4c] hover:text-[#ff8a4c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8a4c]"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <p className="mt-4 text-xs text-slate-500">
                Upfront rates. Verified pros. Support on every booking.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3" role="img" aria-label="Technicians performing home services">
              {HERO_IMAGES.map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  width={400}
                  height={300}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : undefined}
                  className="h-44 w-full rounded-md border border-slate-200 bg-slate-100 object-cover sm:h-56"
                />
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 bg-white">
            <dl className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-0 px-4 sm:px-6 lg:grid-cols-4 lg:px-8" aria-label="Why book with Kazilen">
              {[
                { icon: BadgeCheck, t: "Verified professionals", s: "Admin reviewed experts" },
                { icon: Wallet, t: "Upfront rates", s: "Price shown before you book" },
                { icon: ShieldCheck, t: "OTP secured visits", s: "Start and completion codes" },
                { icon: Star, t: "4.8 rated", s: "2,317 completed bookings" },
              ].map((f) => (
                <div key={f.t} className="flex items-center gap-3 border-slate-200 px-4 py-4 odd:border-r lg:border-r lg:py-5 lg:last:border-r-0">
                  <f.icon size={20} className="shrink-0 text-[#ff8a4c]" aria-hidden="true" />
                  <div className="min-w-0">
                    <dt className="truncate text-sm font-bold text-slate-900">{f.t}</dt>
                    <dd className="truncate text-xs text-slate-500">{f.s}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Categories + services */}
        <section aria-labelledby="categories-heading" className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <h2 id="categories-heading" className="sr-only">Browse trades and services</h2>
          <ServiceBrowser
            categories={catalog.categories || []}
            subCategories={catalog.subCategories || []}
            counts={tradeCounts}
            category={category}
            subCategory={subCategory}
            onCategory={syncCategory}
            onService={syncSub}
          />
        </section>

        {/* Professionals */}
        <section id="professionals" aria-labelledby="pros-heading" className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 pb-4 pt-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 id="pros-heading" className="text-balance text-xl font-bold tracking-tight text-slate-900">
                Available professionals
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">Showing active specialists in your area</p>
            </div>
            {workers.length > 0 && (
              <p className="text-xs font-semibold tabular-nums text-slate-500">
                {fmtInt.format(workers.length)} experts
              </p>
            )}
          </div>

          <div aria-live="polite">
            {!subCategory && (
              <div className="space-y-3 rounded-md border border-slate-200 bg-white px-4 py-16 text-center shadow-2xs">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm bg-[#fff4ed] text-[#ff8a4c]">
                  <Zap size={24} aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Select a service option</h3>
                <p className="mx-auto max-w-sm text-xs text-slate-500">
                  Choose a service option from the categories above to view available technicians.
                </p>
              </div>
            )}

            {subCategory && isLoading && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <ProfessionalCardSkeleton key={index} />
                ))}
              </div>
            )}

            {subCategory && !isLoading && loadError && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-5 text-center">
                <p className="text-sm font-bold text-red-700">{loadError}</p>
                <button
                  type="button"
                  onClick={() => setSubCategory((s) => `${s}`)}
                  className="mt-3 cursor-pointer rounded-sm bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-colors duration-150 hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                >
                  Try again
                </button>
              </div>
            )}

            {subCategory && !isLoading && !loadError && workers?.length === 0 && (
              <div className="space-y-3 rounded-md border border-slate-200 bg-white px-4 py-16 text-center shadow-2xs">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm bg-slate-100 text-slate-400">
                  <Search size={24} aria-hidden="true" />
                </div>
                <p className="text-base font-bold text-slate-900">No professionals found</p>
                <p className="mx-auto max-w-sm text-xs leading-relaxed text-slate-500">
                  No active workers under this option in your area right now. Try another service or check back soon.
                </p>
              </div>
            )}

            {!isLoading && !loadError && workers && workers.length > 0 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {workers.map((worker) => (
                  <ProfessionalCard
                    key={worker.id}
                    professional={worker}
                    subCategory={subCategory}
                    catalogSub={catalog.subCategories?.find((s) => s.id === subCategory)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Offers */}
        {offers.length > 0 && (
          <section aria-labelledby="offers-heading" className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
            <div className="mb-3">
              <h2 id="offers-heading" className="text-balance text-xl font-bold tracking-tight text-slate-900">Offers for you</h2>
              <p className="mt-0.5 text-xs text-slate-500">Admin curated deals, referral rewards and festive savings</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {offers.slice(0, 4).map((o) => (
                <div key={o.id} className="flex gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-2xs">
                  {o.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={o.image} alt="" width={64} height={64} loading="lazy" className="h-16 w-16 shrink-0 rounded-sm border border-slate-200 object-cover" />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-sm bg-[#fff4ed] text-[#ff8a4c]" aria-hidden="true">
                      <Tag size={20} />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-900">{o.title}</p>
                    {o.subtitle && <p className="mt-0.5 text-xs leading-snug text-slate-500 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">{o.subtitle}</p>}
                    {o.discount_code && (
                      <span className="mt-1.5 inline-flex items-center gap-1 rounded-sm border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                        <Tag size={10} aria-hidden="true" /> {o.discount_code}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Referral */}
        <section aria-labelledby="refer-heading" className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <Link href="/profile" className="flex items-center gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-2xs transition-colors duration-150 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8a4c]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#fff4ed] text-[#ff8a4c]">
              <Gift size={18} aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 id="refer-heading" className="text-xs font-bold text-slate-900">Refer and Earn</h2>
              <p className="truncate text-xs leading-snug text-slate-500">Share your code. Friends get booking discounts, you earn rewards.</p>
            </div>
            <span className="shrink-0 rounded-sm bg-[#ff8a4c] px-3 py-1.5 text-xs font-bold text-white">Invite</span>
          </Link>
        </section>

        {/* How it works */}
        <section aria-labelledby="how-heading" className="mx-auto w-full max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
          <h2 id="how-heading" className="text-balance text-xl font-bold tracking-tight text-slate-900">Booked in three steps</h2>
          <p className="mt-0.5 text-xs text-slate-500">From search to a verified pro at your door.</p>
          <ol className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: Search, t: "Tell us the job", s: "Search a service or browse categories. Rates show upfront before you commit." },
              { icon: CalendarCheck, t: "Pick a time that suits you", s: "Reach ASAP in 30 to 45 minutes, or reserve a scheduled slot around your day." },
              { icon: Wallet, t: "Pay after the work", s: "Cash or secure online payment with a full breakup. Rate the job when it is done." },
            ].map((step, i) => (
              <li key={step.t} className="h-full rounded-md border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-slate-900 text-sm font-bold tabular-nums text-white" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#fff4ed] text-[#ff8a4c]" aria-hidden="true">
                    <step.icon size={17} />
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900">{step.t}</h3>
                <p className="mt-1 text-pretty text-xs leading-relaxed text-slate-600">{step.s}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Statement */}
        <section aria-label="Why Kazilen" className="mx-auto w-full max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
          <p className="mx-auto max-w-3xl text-center text-balance text-4xl font-bold leading-[40px] tracking-tight text-slate-900 sm:text-5xl sm:leading-none">
            Fixed rates before you book. Verified pros at your door.
          </p>
        </section>

        {/* Testimonials */}
        <section aria-labelledby="proof-heading" className="mx-auto w-full max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
          <h2 id="proof-heading" className="text-balance text-xl font-bold tracking-tight text-slate-900">Loved by customers</h2>
          <p className="mt-0.5 text-xs text-slate-500">Real bookings, real ratings.</p>
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="flex h-full flex-col rounded-md border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="flex items-center gap-1" aria-label={`Rated ${t.rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      size={13}
                      aria-hidden="true"
                      className={s < t.rating ? "fill-amber-500 text-amber-500" : "fill-slate-200 text-slate-200"}
                    />
                  ))}
                </div>
                <blockquote className="mt-3 flex-1">
                  <p className="text-pretty text-xs leading-relaxed text-slate-700">“{t.text}”</p>
                </blockquote>
                <figcaption className="mt-4 border-t border-slate-100 pt-3">
                  <p className="text-xs font-bold text-slate-900">{t.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin size={11} aria-hidden="true" /> {t.area} · {t.service}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-heading" className="mx-auto w-full max-w-3xl px-4 pt-12 sm:px-6 lg:px-8">
          <h2 id="faq-heading" className="text-balance text-xl font-bold tracking-tight text-slate-900">Questions, answered</h2>
          <p className="mt-0.5 text-xs text-slate-500">Everything about rates, verification, payments and support.</p>
          <div className="mt-5">
            <Faq items={FAQS} />
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: FAQS.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              }),
            }}
          />
        </section>

        {/* Final CTA */}
        <section aria-labelledby="cta-heading" className="mx-auto w-full max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-2xs sm:flex-row sm:items-center sm:p-6">
            <div>
              <h2 id="cta-heading" className="flex items-center gap-2 text-balance text-base font-bold text-slate-900">
                <Wrench size={17} className="text-[#ff8a4c]" aria-hidden="true" />
                Something needs fixing today?
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                ASAP arrival in 30 to 45 minutes, or schedule for later.
              </p>
            </div>
            <button
              type="button"
              onClick={() => document.getElementById("service-search")?.focus()}
              className="shrink-0 cursor-pointer rounded-sm bg-[#ff8a4c] px-4 py-2 text-base font-semibold text-white transition-colors duration-150 hover:bg-[#f07432] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8a4c] focus-visible:ring-offset-2"
            >
              Find your pro
            </button>
          </div>
        </section>
      </main>

      <Footer />
      <OfferPopup />
      <BottomNav />
    </div>
  );
}
