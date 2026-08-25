"use client";

import { useState, useEffect } from "react";
import { X, ShieldCheck, Star, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_BASE_URL, apiFetch } from "@/lib/api";

export default function ViewDetailsButton({ professional, subCategory, price, priceType = "hourly", priceUnit = "/ hr" }) {
	const router = useRouter();
	const [showProfile, setShowProfile] = useState(false);
	const [reviewsData, setReviewsData] = useState(null);
	const [reviewsLoading, setReviewsLoading] = useState(false);

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

	useEffect(() => {
		if (!showProfile || !professional?.id || reviewsData) return;
		const loadReviews = async () => {
			setReviewsLoading(true);
			try {
				const response = await apiFetch(`${API_BASE_URL}/workers/${professional.id}/reviews`);
				const payload = await response.json();
				if (response.ok) {
					setReviewsData(payload);
				}
			} catch {
				// Reviews are supplementary; silently skip on network failure.
			} finally {
				setReviewsLoading(false);
			}
		};

		loadReviews();
	}, [showProfile, professional?.id, reviewsData]);

	const name = professional?.full_name || professional?.name || "Verified Technician";
	const location = professional?.locality || professional?.address || "Nagpur, MH";
	const reviews = Array.isArray(reviewsData?.reviews) ? reviewsData.reviews : [];
	const averageRating = reviewsData?.average_rating != null ? Number(reviewsData.average_rating) : null;
	const totalReviews = Number(reviewsData?.total_reviews_count) || 0;

	const handleBookNow = () => {
		setShowProfile(false);
		router.push(
			`/booking/schedule?worker_id=${professional?.id || ""}&action=${encodeURIComponent(
				subCategory || "consult"
			)}&amount=${price || 150}&price_type=${priceType}`
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
									₹{price || 150} <span className="text-xs font-semibold text-slate-500">{priceUnit}</span>
								</p>
							</div>
						</div>

						{/* Reviews Section */}
						{reviewsLoading && (
							<p className="text-xs text-slate-400">Loading reviews...</p>
						)}
						{!reviewsLoading && totalReviews > 0 && (
							<div className="space-y-2.5">
								<button
									type="button"
									onClick={() => {
										setShowProfile(false);
										router.push(`/worker/${professional.id}/reviews`);
									}}
									className="w-full flex items-center justify-between rounded-md border border-slate-200 bg-white p-3.5 hover:border-[#ff8a4c]/50 transition cursor-pointer"
								>
									<div className="flex items-center gap-2">
										<Star className="w-4 h-4 text-amber-500 fill-amber-500" />
										<span className="text-sm font-bold text-slate-900">
											{averageRating != null ? averageRating.toFixed(1) : "—"}
										</span>
										<span className="text-xs text-slate-500">
											({totalReviews} review{totalReviews === 1 ? "" : "s"})
										</span>
									</div>
									<span className="inline-flex items-center gap-0.5 text-xs font-bold text-[#f07432]">
										View all
										<ChevronRight size={14} />
									</span>
								</button>

								{reviews.slice(0, 2).map((review) => (
									<div key={review.id} className="rounded-md border border-slate-200/80 bg-slate-50 p-3">
										<div className="flex items-center justify-between gap-2">
											<p className="text-xs font-bold text-slate-900 truncate">{review.reviewer_name}</p>
											<div className="flex items-center gap-0.5 shrink-0">
												{[1, 2, 3, 4, 5].map((value) => (
													<Star
														key={value}
														size={11}
														className={Number(review.rating) >= value ? "text-amber-500 fill-amber-500" : "text-slate-300"}
														fill={Number(review.rating) >= value ? "currentColor" : "none"}
													/>
												))}
											</div>
										</div>
										<p className="mt-1.5 text-xs leading-relaxed text-slate-600 line-clamp-2">
											{review.description}
										</p>
									</div>
								))}
							</div>
						)}

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
