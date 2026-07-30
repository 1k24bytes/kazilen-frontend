"use client";

import { Star, MapPin, ShieldCheck, Clock } from "lucide-react";
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
		<div className="w-full bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs hover:shadow-md hover:border-[#ffd5be] transition duration-200 flex flex-col justify-between space-y-4 group">
			<div>
				<div className="flex justify-between items-start gap-3">
					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight group-hover:text-[#ff8a4c] transition-colors">
								{professional.name}
							</h3>
							<span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
								<ShieldCheck size={12} className="text-emerald-600" />
								Verified
							</span>
						</div>
						
						<p className="text-xs text-slate-500 flex items-center gap-1">
							<MapPin size={13} className="text-slate-400 shrink-0" />
							<span className="truncate max-w-[220px]">{professional.address || "Nagpur, MH"}</span>
						</p>
					</div>

					<div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#fff4ed] border border-[#ffd5be] text-[#ea580c] text-xs font-bold shrink-0 shadow-2xs">
						<Star className="w-3.5 h-3.5 text-[#ff8a4c] fill-[#ff8a4c]" />
						<span>{professional.rating || "4.8"}</span>
					</div>
				</div>

				<div className="mt-3.5 flex items-center gap-3 text-xs text-slate-500 border-t border-slate-100 pt-3">
					<span className="flex items-center gap-1 text-slate-600 font-medium">
						<Clock size={13} className="text-[#ff8a4c]" />
						<span>Arrives in 30 mins</span>
					</span>
					<span>•</span>
					<span className="text-slate-500">Over 150+ jobs completed</span>
				</div>
			</div>

			<div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
				<ViewDetailsButton
					professional={professional}
					subCategory={subCategory}
					details={details}
					price={price}
				/>

				<div className="flex items-center gap-3">
					<div className="text-right">
						<span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Starting at</span>
						<span className="text-base font-extrabold text-slate-900">
							₹{price} <span className="text-xs font-normal text-slate-500">/ hr</span>
						</span>
					</div>

					<button
						onClick={handleBookNow}
						className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-[#ff8a4c] hover:bg-[#f07432] text-white shadow-sm shadow-orange-500/20 transition cursor-pointer active:scale-95"
					>
						Book Now
					</button>
				</div>
			</div>
		</div>
	);
}
