"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AlertCircle, Loader2, Star } from "lucide-react";

import { API_BASE_URL, apiFetch } from "@/lib/api";
import servicesConfig from "@/app/data/services.json";
import BottomNav from "@/app/components/BottomNav";

function getServiceLabel(serviceId) {
	const service = servicesConfig.subCategories.find((item) => item.id === serviceId);
	return (
		service?.label ||
		serviceId?.replace(/-/g, " ").replace(/\b\w/g, (character) => character.toUpperCase()) ||
		"Service"
	);
}

function formatDate(value) {
	if (!value) return "";
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
}

function RatingStars({ rating }) {
	return (
		<div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
			{[1, 2, 3, 4, 5].map((value) => (
				<Star
					key={value}
					size={14}
					className={rating >= value ? "text-amber-500 fill-amber-500" : "text-slate-300"}
					fill={rating >= value ? "currentColor" : "none"}
				/>
			))}
		</div>
	);
}

export default function WorkerReviewsPage() {
	const params = useParams();
	const workerId = params?.id;

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!workerId) return;
		const loadReviews = async () => {
			try {
				const response = await apiFetch(`${API_BASE_URL}/workers/${workerId}/reviews`);
				const payload = await response.json();
				if (!response.ok) {
					setError(payload.detail || "Could not load reviews for this technician.");
					return;
				}
				setData(payload);
			} catch {
				setError("Network error. Please try again.");
			} finally {
				setLoading(false);
			}
		};

		loadReviews();
	}, [workerId]);

	const reviews = data?.reviews || [];

	return (
		<div className="min-h-screen bg-slate-50 font-sans text-slate-900">
			<header className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-4 shadow-2xs">
				<div className="max-w-3xl mx-auto">
					<h1 className="text-lg font-bold tracking-tight text-slate-900">Technician Reviews</h1>
					<p className="mt-0.5 text-xs text-slate-500">
						{data?.worker_name || "Verified Technician"} · Customer feedback from completed jobs
					</p>
				</div>
			</header>

			<main className="mx-auto max-w-3xl space-y-5 px-4 py-6 sm:px-6">
				{loading && (
					<div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-400">
						<Loader2 size={18} className="animate-spin" />
						Loading reviews...
					</div>
				)}

				{!loading && error && (
					<div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-600">
						<AlertCircle size={15} />
						{error}
					</div>
				)}

				{!loading && !error && data && (
					<>
						{/* Rating Summary Card */}
						<section className="rounded-md border border-slate-200 bg-white p-5 shadow-2xs flex items-center justify-between gap-4">
							<div>
								<p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average rating</p>
								<div className="mt-1 flex items-end gap-2">
									<span className="text-3xl font-extrabold text-slate-900 leading-none">
										{data.average_rating != null ? Number(data.average_rating).toFixed(1) : "—"}
									</span>
									<span className="text-xs font-semibold text-slate-500 pb-0.5">/ 5</span>
								</div>
								<p className="mt-1 text-xs text-slate-500">
									Based on {data.total_reviews_count} review{data.total_reviews_count === 1 ? "" : "s"}
								</p>
							</div>
							<div className="flex flex-col items-end gap-1.5">
								<RatingStars rating={Math.round(Number(data.average_rating) || 0)} />
								<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border border-slate-200 bg-slate-100 text-[10px] font-semibold text-slate-600">
									Completed jobs only
								</span>
							</div>
						</section>

						{/* Reviews List */}
						<section className="space-y-3">
							<h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
								All reviews
							</h2>

							{reviews.length === 0 ? (
								<div className="rounded-md border border-slate-200 bg-white p-8 text-center shadow-2xs">
									<Star size={24} className="mx-auto text-slate-300" />
									<p className="mt-3 text-sm font-bold text-slate-900">No reviews yet</p>
									<p className="mt-1 text-xs text-slate-500">
										This technician has not received any customer reviews yet.
									</p>
								</div>
							) : (
								reviews.map((review) => (
									<article
										key={review.id}
										className="rounded-md border border-slate-200 bg-white p-4 shadow-2xs"
									>
										<div className="flex items-start justify-between gap-3">
											<div className="min-w-0">
												<p className="text-sm font-bold text-slate-900 truncate">{review.reviewer_name}</p>
												<p className="mt-0.5 text-[11px] text-slate-500">
													{getServiceLabel(review.service_id)} · Booking #{review.booking_id}
												</p>
											</div>
											<RatingStars rating={Number(review.rating)} />
										</div>
										<p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
											{review.description}
										</p>
										<p className="mt-3 text-[10px] text-slate-400">
											Submitted {formatDate(review.created_at)}
										</p>
									</article>
								))
							)}
						</section>
					</>
				)}
			</main>

			<BottomNav />
		</div>
	);
}
