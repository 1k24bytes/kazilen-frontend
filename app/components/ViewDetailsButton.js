"use client";

import { useState, useEffect } from "react";
import { X, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ViewDetailsButton({ professional, subCategory, price }) {
	const router = useRouter();
	const [showProfile, setShowProfile] = useState(false);

	useEffect(() => {
		if (showProfile) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [showProfile]);

	const name = professional?.full_name || professional?.name || "Verified Technician";
	const location = professional?.locality || professional?.address || "Nagpur, MH";

	const handleBookNow = () => {
		setShowProfile(false);
		router.push(
			`/booking/schedule?worker_id=${professional?.id || ""}&action=${encodeURIComponent(
				subCategory || "consult"
			)}&amount=${price || 150}`
		);
	};

	return (
		<>
			<button
				onClick={() => setShowProfile(true)}
				className="px-3.5 py-2 text-xs font-bold rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
			>
				View details
			</button>

			{/* Modal Overlay */}
			{showProfile && (
				<div 
					onClick={() => setShowProfile(false)}
					className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs z-50 p-4"
				>
					<div 
						onClick={(e) => e.stopPropagation()}
						className="bg-white rounded-md border border-slate-200 w-full max-w-md p-6 text-slate-900 space-y-5 shadow-xl relative"
					>
						{/* Header */}
						<div className="flex justify-between items-center pb-3 border-b border-slate-100">
							<h3 className="font-bold text-slate-900 text-base">Technician Details</h3>
							<button
								onClick={() => setShowProfile(false)}
								className="w-8 h-8 rounded-sm hover:bg-slate-100 text-slate-500 flex items-center justify-center transition cursor-pointer"
								aria-label="Close modal"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						{/* Technician Summary Card */}
						<div className="flex items-center gap-3.5 p-4 rounded-md bg-slate-50 border border-slate-200/80">
							<div className="w-12 h-12 rounded-md bg-[#ff8a4c] text-white font-bold text-lg flex items-center justify-center shrink-0">
								{name.charAt(0).toUpperCase()}
							</div>
							<div className="min-w-0 flex-1">
								<div className="flex items-center gap-2">
									<h4 className="text-sm font-bold text-slate-900 truncate">
										{name}
									</h4>
									<span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-sm border border-emerald-200 shrink-0">
										<ShieldCheck size={11} /> Verified
									</span>
								</div>
								<p className="text-xs text-slate-500 truncate mt-0.5">
									{location}
								</p>
							</div>
						</div>

						{/* Service & Price Box */}
						<div className="p-4 bg-slate-50/50 rounded-md border border-slate-200/80 flex items-center justify-between">
							<div>
								<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Service</span>
								<p className="text-sm font-bold text-slate-900 capitalize">
									{typeof subCategory === "string" ? subCategory.replace(/-/g, " ") : "Electrician Service"}
								</p>
							</div>
							<div className="text-right">
								<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rate</span>
								<p className="text-xl font-extrabold text-slate-900">
									₹{price || 150}
								</p>
							</div>
						</div>

						{/* Action Button */}
						<button
							onClick={handleBookNow}
							className="w-full bg-[#ff8a4c] hover:bg-[#f07432] text-white font-bold py-3 rounded-sm text-sm shadow-2xs transition cursor-pointer active:scale-98"
						>
							Book Now
						</button>
					</div>
				</div>
			)}
		</>
	);
}
