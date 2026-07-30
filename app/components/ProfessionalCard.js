"use client";

import { Star, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import ViewDetailsButton from "./ViewDetailsButton";

export default function ProfessionalCard({ professional, subCategory }) {
	const router = useRouter();

	const price = professional.sub_categories?.price ?? 120;
	const details = professional.sub_categories?.details ?? "";

	const handleBookNow = () => {
		router.push(
			`/booking/schedule?worker_id=${professional.id}&action=${encodeURIComponent(
				subCategory
			)}&amount=${price}`
		);
	};

	return (
		<div className="w-full bg-white rounded-lg border border-zinc-200/80 p-5 shadow-2xs hover:shadow-xs transition space-y-4">
			<div className="flex justify-between items-start gap-3">
				<div>
					<h3 className="text-base font-semibold text-zinc-900 tracking-tight">
						{professional.name}
					</h3>
					<p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
						<MapPin size={12} className="text-zinc-400 shrink-0" />
						<span className="truncate max-w-[220px]">{professional.address || "Nagpur"}</span>
					</p>
				</div>

				<div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50/80 border border-amber-200/60 text-amber-800 text-xs font-semibold shrink-0">
					<Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
					<span>{professional.rating || "4.8"}</span>
				</div>
			</div>

			<div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-3">
				<ViewDetailsButton
					professional={professional}
					subCategory={subCategory}
					details={details}
					price={price}
				/>

				<div className="flex items-center gap-3">
					<div className="text-right">
						<span className="text-xs text-zinc-500 block">Rate</span>
						<span className="text-sm font-bold text-zinc-900">₹{price} <span className="text-[11px] font-normal text-zinc-500">/ hr</span></span>
					</div>

					<button
						onClick={handleBookNow}
						className="px-4 py-2 text-xs font-medium rounded-md bg-zinc-900 hover:bg-zinc-800 text-white shadow-xs transition cursor-pointer"
					>
						Book Now
					</button>
				</div>
			</div>
		</div>
	);
}
