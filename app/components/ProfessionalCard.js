"use client";

import { Star, MapPin, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import ViewDetailsButton from "./ViewDetailsButton";
import servicesData from "../data/services.json";

export default function ProfessionalCard({ professional, subCategory, catalogSub }) {
	const router = useRouter();

	const fullName = professional.full_name || professional.name || "Verified Technician";

	// Default pricing: admin catalog first, services.json fallback
	const foundSubCategory = catalogSub || servicesData?.subCategories?.find(
		(s) => s.id === subCategory
	);

	// Check if worker has set a custom service rate for this specific subCategory
	let customService = null;
	if (Array.isArray(professional.offered_services)) {
		customService = professional.offered_services.find(
			(s) => typeof s === "object" && s.id === subCategory
		);
	}

	let price = 199;
	let priceUnit = "/ hr";
	let priceType = "hourly";

	if (customService) {
		const isFixed =
			customService.price_type === "fixed" ||
			(!customService.price_per_hour && (customService.fixed_price || customService.price_per_day));
		price =
			customService.price ||
			(isFixed ? (customService.fixed_price || customService.price_per_day) : customService.price_per_hour) ||
			(isFixed ? 249 : 199);
		priceType = isFixed ? "fixed" : "hourly";
		priceUnit = isFixed ? "Fixed" : "/ hr";
	} else if (foundSubCategory) {
		const priceTypeRaw = foundSubCategory.price_type || foundSubCategory.default_price_type;
		const fixedRaw = foundSubCategory.fixed_price ?? foundSubCategory.default_fixed_price;
		const hourlyRaw = foundSubCategory.price_per_hour ?? foundSubCategory.default_price_per_hour;
		const isFixed = priceTypeRaw === "fixed" || Boolean(fixedRaw);
		price = isFixed ? (fixedRaw || 249) : (hourlyRaw || 199);
		priceType = isFixed ? "fixed" : "hourly";
		priceUnit = isFixed ? "Fixed" : "/ hr";
	}

	const serviceLabel = foundSubCategory?.label || "Service";

	const handleBookNow = () => {
		router.push(
			`/booking/schedule?worker_id=${professional.id}&action=${encodeURIComponent(
				subCategory || "consult"
			)}&amount=${price}&price_type=${priceType}`
		);
	};

	return (
		<div className="w-full bg-white rounded-md border border-slate-200 p-5 shadow-2xs hover:border-[#ff8a4c]/50 transition flex flex-col justify-between space-y-4">
			<div className="space-y-3">
			{/* Top Row: Photo + Name + Verified + Rating */}
			<div className="flex items-start justify-between gap-3">
				<div className="flex items-start gap-3 min-w-0">
					{professional.profile_photo ? (
						<img
							src={professional.profile_photo}
							alt={fullName}
							className="w-10 h-10 rounded-sm border border-slate-200 object-cover shrink-0"
						/>
					) : (
						<div className="w-10 h-10 rounded-sm bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold shrink-0">
							{(fullName || "V").trim().charAt(0).toUpperCase()}
						</div>
					)}
					<div className="space-y-1 min-w-0">
						<div className="flex items-center gap-2 flex-wrap">
							<h3 className="text-base font-bold text-slate-900 tracking-tight truncate">
								{fullName}
							</h3>
							<span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-sm border border-emerald-200 shrink-0">
								<ShieldCheck size={12} className="text-emerald-600" />
								Verified
							</span>
						</div>

						<p className="text-xs text-slate-500 flex items-center gap-1">
							<MapPin size={13} className="text-slate-400 shrink-0" />
							<span className="truncate">
								{professional.locality || professional.address || "Nagpur, MH"}
								{Number.isFinite(Number(professional.distance_km)) && ` · ${Number(professional.distance_km)} km away`}
							</span>
						</p>
					</div>
					</div>
				</div>

					{professional.rating && Number(professional.rating) > 0 && professional.reviews_count !== 0 ? (
						<div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shrink-0">
							<Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
							<span>{Number(professional.rating).toFixed(1)}</span>
							{professional.reviews_count > 0 && (
								<span className="text-[10px] font-normal text-amber-700">({professional.reviews_count})</span>
							)}
						</div>
					) : null}
			</div>

			{/* Bottom Action & Price Row */}
			<div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
				<ViewDetailsButton
					professional={{ ...professional, name: fullName }}
					subCategory={subCategory}
					details={`Configured rate for ${serviceLabel}`}
					price={price}
					priceType={priceType}
					priceUnit={priceUnit}
				/>

				<div className="flex items-center gap-3">
					<div className="text-right">
						<span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Rate</span>
						<span className="text-base font-extrabold text-slate-900">
							₹{price} <span className="text-xs font-semibold text-slate-500">{priceUnit}</span>
						</span>
					</div>

					<button
						onClick={handleBookNow}
						className="px-4 py-2 text-xs font-bold rounded-sm bg-[#ff8a4c] hover:bg-[#f07432] text-white shadow-2xs transition cursor-pointer active:scale-98"
					>
						Book Now
					</button>
				</div>
			</div>
		</div>
	);
}
