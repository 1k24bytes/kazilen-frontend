"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, X, ChevronDown, ChevronUp, XCircle, User } from "lucide-react";

export default function ViewDetailsButton({ professional, subCategory, details, price }) {
	const [showProfile, setShowProfile] = useState(false);
	const [openFaq, setOpenFaq] = useState(null);

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

	const toggleFaq = (index) => {
		setOpenFaq(openFaq === index ? null : index);
	};

	const processSteps = [
		{
			step: 1,
			title: "Inspection",
			desc: "We inspect your switch/socket & share a repair quote for approval",
		},
		{
			step: 2,
			title: "Quote approval",
			desc: "You can approve the quote to proceed, or pay a visitation charge if declined",
		},
		{
			step: 3,
			title: "Repair & spare parts",
			desc: "If needed, we will source spare parts from the local market",
		},
		{
			step: 4,
			title: "Replacement, if needed",
			desc: "If repair is not possible, we will replace the switch/socket",
		},
		{
			step: 5,
			title: "Warranty activation",
			desc: "The service is covered by a 30-day warranty for any issues after repair",
		},
	];

	const exclusions = [
		"Wiring beyond 2 meters is not included. Extra charges apply.",
		"Cost of new spare parts or switchboards is excluded from the service charge.",
	];

	const faqs = [
		{
			question: "Does the cost include spare parts?",
			answer: "No, spare parts are charged separately based on actual market rates or provided by the customer.",
		},
		{
			question: "What if the same issue occurs again?",
			answer: "Our services come with a 30-day warranty. If the issue reoccurs within 30 days, we revisit free of charge.",
		},
		{
			question: "What if anything gets damaged?",
			answer: "We offer damage protection up to ₹10,000 for any verified accidental property damage during service.",
		},
		{
			question: "Are spare parts covered under warranty?",
			answer: "Spare parts carry the respective manufacturer warranty. Our warranty covers the installation labor and service quality.",
		},
	];

	const reviews = [
		{
			id: 1,
			name: "Rahul Sharma",
			date: "July 2026",
			rating: 5,
			comment: "Excellent service! Fixed 3 faulty switches quickly and tested everything before leaving.",
		},
		{
			id: 2,
			name: "Priya Patel",
			date: "June 2026",
			rating: 5,
			comment: "Punctual and very professional. Explained the problem clearly.",
		},
		{
			id: 3,
			name: "Amit Kumar",
			date: "June 2026",
			rating: 4,
			comment: "Good work. Cleaned up after finishing the replacement job.",
		},
	];

	return (
		<>
			<button
				onClick={() => setShowProfile(true)}
				className="px-3 py-1.5 text-xs font-medium rounded-md bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 border border-zinc-200/80 transition cursor-pointer"
			>
				View details
			</button>

			{/* Modal Overlay */}
			{showProfile && (
				<div 
					onClick={() => setShowProfile(false)}
					className="fixed inset-0 flex items-end justify-center sm:items-center bg-black/40 backdrop-blur-xs z-50 p-0 sm:p-4"
				>
					<div 
						onClick={(e) => e.stopPropagation()}
						className="bg-white rounded-t-xl sm:rounded-lg border border-zinc-200 w-full max-w-xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto shadow-xl relative p-5 sm:p-6 text-zinc-900 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-200"
					>
						{/* Drag Handle for mobile */}
						<div className="w-10 h-1 bg-zinc-200 rounded-full mx-auto -mt-1 mb-2 sm:hidden" />

						{/* Sticky Header */}
						<div className="sticky -top-5 sm:-top-6 -mx-5 sm:-mx-6 px-5 sm:px-6 py-3 bg-white/95 backdrop-blur-md z-30 flex justify-between items-center border-b border-zinc-100">
							<h3 className="font-semibold text-zinc-900 text-sm sm:text-base">Service & Worker Details</h3>
							<button
								onClick={() => setShowProfile(false)}
								className="w-8 h-8 rounded-md hover:bg-zinc-100 text-zinc-500 flex items-center justify-center transition cursor-pointer"
								aria-label="Close modal"
							>
								<X className="w-4 h-4" />
							</button>
						</div>

						{/* Worker Header */}
						<div className="flex items-center gap-3.5 p-4 rounded-lg bg-zinc-50 border border-zinc-200/80">
							<div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-200 border border-zinc-300 flex-shrink-0 flex items-center justify-center">
								{professional?.image ? (
									<Image
										src={professional.image}
										alt={professional.name}
										fill
										className="object-cover"
									/>
								) : (
									<User className="w-6 h-6 text-zinc-400" />
								)}
							</div>
							<div className="flex-1 min-w-0">
								<h3 className="text-sm font-semibold text-zinc-900 truncate">
									{professional?.name || "Professional Worker"}
								</h3>
								<p className="text-xs text-zinc-500 truncate mt-0.5">
									{professional?.address || "Verified Technician"}
								</p>
								<div className="flex items-center gap-1.5 mt-1">
									<div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200/60 text-amber-800 text-[11px] font-medium">
										<Star className="w-3 h-3 text-amber-500 fill-amber-400" />
										<span>{professional?.rating || 4.83}</span>
									</div>
									<span className="text-[11px] text-zinc-400">
										• {professional?.phoneNo ? `Ph: ${professional.phoneNo}` : "Verified"}
									</span>
								</div>
							</div>
						</div>

						{/* Subcategory Info & Price */}
						<div className="border-b border-zinc-100 pb-5">
							<div className="flex justify-between items-start gap-4">
								<div className="space-y-1">
									<h2 className="text-lg font-bold text-zinc-900 leading-tight">
										{typeof subCategory === "string" ? subCategory : "Switch/socket repair & replacement"}
									</h2>
									<div className="flex items-center gap-1.5 text-xs text-zinc-500">
										<Star className="w-3.5 h-3.5 text-zinc-700 fill-zinc-700" />
										<span className="font-semibold text-zinc-900">
											{professional?.rating || 4.83}
										</span>
										<span>(182K reviews)</span>
									</div>
									<p className="text-lg font-bold text-zinc-900 mt-2">
										₹{price || 120} <span className="text-xs font-normal text-zinc-500">/ hour</span>
									</p>
								</div>
							</div>
						</div>

						{/* Process */}
						<div className="space-y-3 border-b border-zinc-100 pb-5">
							<h3 className="text-sm font-semibold text-zinc-900">Our process</h3>
							<div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-zinc-200">
								{processSteps.map((item) => (
									<div key={item.step} className="relative flex items-start gap-3">
										<div className="absolute -left-5 top-0.5 w-4 h-4 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10px] font-medium z-10">
											{item.step}
										</div>
										<div className="pl-2">
											<h4 className="text-xs font-semibold text-zinc-900">
												{item.title}
											</h4>
											<p className="text-xs text-zinc-500 mt-0.5 leading-normal">
												{item.desc}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Exclusions */}
						<div className="space-y-2 border-b border-zinc-100 pb-5">
							<h3 className="text-sm font-semibold text-zinc-900">What is excluded?</h3>
							<div className="space-y-1.5">
								{exclusions.map((text, idx) => (
									<div key={idx} className="flex items-start gap-2 text-xs text-zinc-600">
										<XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
										<p className="leading-normal">{text}</p>
									</div>
								))}
							</div>
						</div>

						{/* FAQs */}
						<div className="space-y-3 border-b border-zinc-100 pb-5">
							<h3 className="text-sm font-semibold text-zinc-900">Frequently asked questions</h3>
							<div className="divide-y divide-zinc-100 border-t border-b border-zinc-100">
								{faqs.map((faq, idx) => (
									<div key={idx} className="py-2.5">
										<button
											onClick={() => toggleFaq(idx)}
											className="w-full flex justify-between items-center text-left text-xs font-medium text-zinc-800 hover:text-zinc-900 transition-colors gap-2 cursor-pointer"
										>
											<span>{faq.question}</span>
											{openFaq === idx ? (
												<ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
											) : (
												<ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
											)}
										</button>
										{openFaq === idx && (
											<p className="text-xs text-zinc-500 mt-1.5 leading-normal pl-0.5">
												{faq.answer}
											</p>
										)}
									</div>
								))}
							</div>
						</div>

						{/* Reviews */}
						<div className="space-y-3">
							<h3 className="text-sm font-semibold text-zinc-900">Customer reviews</h3>
							<div className="space-y-2.5">
								{reviews.map((rev) => (
									<div key={rev.id} className="p-3 rounded-lg border border-zinc-200/80 bg-zinc-50/50 space-y-1">
										<div className="flex justify-between items-center">
											<span className="text-xs font-medium text-zinc-900">{rev.name}</span>
											<span className="text-[10px] text-zinc-400">{rev.date}</span>
										</div>
										<div className="flex items-center text-amber-400 gap-0.5">
											{[...Array(rev.rating)].map((_, i) => (
												<Star key={i} className="w-3 h-3 fill-amber-400" />
											))}
										</div>
										<p className="text-xs text-zinc-600 leading-normal">{rev.comment}</p>
									</div>
								))}
							</div>
						</div>

					</div>
				</div>
			)}
		</>
	);
}
