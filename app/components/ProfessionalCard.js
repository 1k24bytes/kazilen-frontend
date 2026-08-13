"use client";

import { Star, MapPin, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import ViewDetailsButton from "./ViewDetailsButton";
import servicesData from "../data/services.json";

export default function ProfessionalCard({ professional, subCategory }) {
	const router = useRouter();

	const fullName = professional.full_name || professional.name || "Verified Technician";

	// Look up subcategory default configuration from services.json
	const foundSubCategory = servicesData?.subCategories?.find(
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
		const isFixed =
			foundSubCategory.default_price_type === "fixed" ||
			Boolean(foundSubCategory.default_fixed_price);
		price = isFixed
			? (foundSubCategory.default_fixed_price || 249)
			: (foundSubCategory.default_price_per_hour || 199);
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
				{/* Top Row: Name + Verified + Rating */}
				<div className="flex items-start justify-between gap-3">
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
							<span className="truncate">{professional.locality || professional.address || "Nagpur, MH"}</span>
						</p>
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
