"use client";

import { useState, useEffect } from "react";
import CategoryTabs from "./components/CategoryTabs";
import SubCategoryTabs from "./components/SubCategoryTabs";
import ProfessionalCard from "./components/ProfessionalCard";
import ProfessionalCardSkeleton from "./components/skeletons/ProfessionalCardSkeleton";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import OfferPopup from "./components/OfferPopup";
import { Search, Zap, Gift, Tag } from "lucide-react";
import Link from "next/link";
import { API_BASE_URL, apiFetch } from "@/lib/api";

export default function HomePage() {
	const [category, setCategory] = useState("Electrician");
	const [subCategory, setSubCategory] = useState("consult");
	const [catalog, setCatalog] = useState({ categories: [], subCategories: [] });
	const [offers, setOffers] = useState([]);

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
	}, []);

	const [workers, setWorkers] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		async function fetchWorkers() {
			if (!subCategory) {
				setWorkers([]);
				return;
			}

			setIsLoading(true);
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
				}
			} catch (error) {
				console.error("Failed to fetch workers:", error);
				setWorkers([]);
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
		return () => {
			active = false;
		};
	}, []);

	return (
		<div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
			{/* Top Header */}
			<Header />

			{/* Main Content Area */}
			<main className="flex-1 pb-16">
				{/* Category Selector */}
				<CategoryTabs
					value={category}
					onChange={(val) => {
						setCategory(val);
						setSubCategory("");
					}}
				/>

				{/* Sub Category Selector */}
				{category && (
					<SubCategoryTabs
						value={subCategory}
						onChange={setSubCategory}
						category={category}
					/>
				)}

				{/* Workers Grid Section */}
				<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 w-full">

					{offers.length > 0 && (
						<div className="mb-6">
							<div className="flex items-center justify-between mb-3">
								<div>
									<h2 className="text-base font-bold text-slate-900 tracking-tight">Offers for you</h2>
									<p className="text-xs text-slate-500 mt-0.5">Admin-curated deals, referral rewards and festive savings</p>
								</div>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{offers.slice(0, 4).map((o) => (
									<div key={o.id} className="bg-white rounded-md border border-slate-200 p-4 shadow-2xs flex gap-3">
										{o.image ? (
											// eslint-disable-next-line @next/next/no-img-element
											<img src={o.image} alt={o.title} className="w-16 h-16 rounded-sm border border-slate-200 object-cover shrink-0" />
										) : (
											<div className="w-16 h-16 rounded-sm bg-[#fff4ed] text-[#ff8a4c] flex items-center justify-center shrink-0">
												<Tag size={20} />
											</div>
										)}
										<div className="min-w-0 flex-1">
											<p className="text-xs font-bold text-slate-900 truncate">{o.title}</p>
											{o.subtitle && <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{o.subtitle}</p>}
											{o.discount_code && (
												<span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
													<Tag size={10} /> {o.discount_code}
												</span>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					<Link href="/profile" className="block mb-6 bg-white rounded-md border border-slate-200 p-4 shadow-2xs flex items-center gap-3 hover:border-slate-300 transition">
						<div className="w-10 h-10 rounded-sm bg-[#fff4ed] text-[#ff8a4c] flex items-center justify-center shrink-0">
							<Gift size={18} />
						</div>
						<div className="min-w-0 flex-1">
							<p className="text-xs font-bold text-slate-900">Refer & Earn</p>
							<p className="text-[11px] text-slate-500 leading-snug">Share your code — friends get booking discounts, you earn rewards</p>
						</div>
						<span className="text-xs font-bold text-white bg-[#ff8a4c] px-3 py-1.5 rounded-sm shrink-0">Invite</span>
					</Link>
					
					{/* Section Title */}
					<div className="flex items-center justify-between mb-6">
						<div>
							<h2 className="text-xl font-bold text-slate-900 tracking-tight">
								Available Professionals
							</h2>
							<p className="text-xs text-slate-500 mt-0.5">
								Showing active specialists in your area
							</p>
						</div>

						{workers.length > 0 && (
							<span className="text-xs font-semibold px-3 py-1 rounded-sm bg-slate-200/80 text-slate-700">
								{workers.length} Experts Available
							</span>
						)}
					</div>

					{!subCategory && (
						<div className="text-center py-16 bg-white rounded-md border border-slate-200/80 shadow-2xs space-y-3">
							<div className="w-12 h-12 rounded-sm bg-[#fff4ed] text-[#ff8a4c] flex items-center justify-center mx-auto">
								<Zap size={24} />
							</div>
							<h3 className="text-base font-bold text-slate-900">Select a Service Option</h3>
							<p className="text-xs text-slate-500 max-w-sm mx-auto">
								Please choose a service option from the categories above to view available technicians.
							</p>
						</div>
					)}

					{subCategory && isLoading && (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{Array.from({ length: 3 }).map((_, index) => (
								<ProfessionalCardSkeleton key={index} />
							))}
						</div>
					)}

					{subCategory && !isLoading && workers?.length === 0 && (
						<div className="text-center py-16 px-4 rounded-md border border-slate-200/80 bg-white shadow-2xs space-y-3">
							<div className="w-12 h-12 rounded-sm bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
								<Search size={24} />
							</div>
							<p className="text-base font-bold text-slate-900">No professionals found</p>
							<p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
								There are currently no active workers registered under this specific service option in your immediate area right now.
							</p>
						</div>
					)}

					{!isLoading && workers && workers.length > 0 && (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
				</section>
			</main>

			<OfferPopup />
			<BottomNav />
		</div>
	);
}
