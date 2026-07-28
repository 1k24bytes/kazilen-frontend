"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, X, ChevronDown, ChevronUp, XCircle, User } from "lucide-react";

export default function ViewDetailsButton({ professional, subCategory, details, price }) {
	const [showProfile, setShowProfile] = useState(false);
	const [openFaq, setOpenFaq] = useState(null);

	// Lock body scrolling when modal is open to prevent background page scrolling
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
				className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
			>
				View details
			</button>

			{/* Bottom Sheet / Modal Popup */}
			{showProfile && (
				<div 
					onClick={() => setShowProfile(false)}
					className="fixed inset-0 flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-sm z-50 transition-opacity"
				>
					<div 
						onClick={(e) => e.stopPropagation()}
						className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 md:p-8 text-gray-800 space-y-6 overscroll-contain transition-transform transform translate-y-0 duration-300"
					>
						{/* Mobile Sheet Drag Handle Indicator */}
						<div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto -mt-2 mb-2 sm:hidden" />

						{/* Sticky Top Bar with Close Button */}
						<div className="sticky -top-6 sm:-top-8 -mx-6 sm:-mx-8 px-6 sm:px-8 py-3 bg-white/95 backdrop-blur-md z-30 flex justify-between items-center border-b border-gray-100 mb-4">
							<h3 className="font-bold text-gray-900 text-base sm:text-lg">Service & Worker Details</h3>
							<button
								onClick={() => setShowProfile(false)}
								className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors focus:outline-none"
								aria-label="Close modal"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						{/* 1. Worker Header Div (Name, Image, Rating) */}
						<div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
							<div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 border-2 border-pink-500 flex-shrink-0 flex items-center justify-center text-gray-500">
								{professional?.image ? (
									<Image
										src={professional.image}
										alt={professional.name}
										fill
										className="object-cover"
									/>
								) : (
									<User className="w-8 h-8 text-gray-400" />
								)}
							</div>
							<div className="flex-1 min-w-0">
								<h3 className="text-lg font-bold text-gray-900 truncate">
									{professional?.name || "Professional Worker"}
								</h3>
								<p className="text-xs text-gray-500 truncate">
									{professional?.address || "Verified Technician"}
								</p>
								<div className="flex items-center gap-1.5 mt-1">
									<div className="flex items-center bg-amber-100 px-2 py-0.5 rounded-md">
										<Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
										<span className="ml-1 text-xs font-semibold text-amber-900">
											{professional?.rating || 4.83}
										</span>
									</div>
									<span className="text-xs text-gray-500">
										• {professional?.phoneNo ? `Ph: ${professional.phoneNo}` : "Verified"}
									</span>
								</div>
							</div>
						</div>

						{/* 2. Subcategory Name, Price & Subcategory Image */}
						<div className="border-b pb-6">
							<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
								<div className="space-y-1">
									<h2 className="text-2xl font-bold text-gray-900 leading-tight">
										{typeof subCategory === "string" ? subCategory : "Switch/socket repair & replacement"}
									</h2>
									<div className="flex items-center gap-1.5 text-sm text-gray-600">
										<Star className="w-4 h-4 text-gray-800 fill-gray-800" />
										<span className="font-semibold text-gray-900">
											{professional?.rating || 4.83}
										</span>
										<span className="text-gray-500 underline decoration-dashed">
											(182K reviews)
										</span>
									</div>
									<p className="text-xl font-extrabold text-pink-600 mt-2">
										₹{price || 120} <span className="text-xs font-normal text-gray-500">/ hour</span>
									</p>
								</div>

								<div className="relative w-28 h-28 rounded-2xl bg-gray-100 border overflow-hidden flex-shrink-0 flex items-center justify-center self-center sm:self-auto">
									{professional?.sub_categories?.image ? (
										<Image
											src={professional.sub_categories.image}
											alt="Subcategory"
											fill
											className="object-cover"
										/>
									) : (
										<div className="text-center p-2">
											<div className="w-12 h-12 mx-auto mb-1 bg-white rounded-lg border shadow-sm flex items-center justify-center text-xs font-bold text-gray-700">
												32 A.D.P.
											</div>
											<span className="text-[10px] text-gray-400">Socket & Switch</span>
										</div>
									)}
								</div>
							</div>
						</div>

						{/* 3. Our Process */}
						<div className="space-y-4 border-b pb-6">
							<h3 className="text-xl font-bold text-gray-900">Our process</h3>
							<div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
								{processSteps.map((item) => (
									<div key={item.step} className="relative flex items-start gap-4">
										<div className="absolute -left-6 top-0 w-6 h-6 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-bold text-gray-700 z-10 bg-white">
											{item.step}
										</div>
										<div className="pl-3">
											<h4 className="text-sm font-bold text-gray-900">
												{item.title}
											</h4>
											<p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
												{item.desc}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* 4. What is excluded? */}
						<div className="space-y-3 border-b pb-6">
							<h3 className="text-xl font-bold text-gray-900">What is excluded?</h3>
							<div className="space-y-2">
								{exclusions.map((text, idx) => (
									<div key={idx} className="flex items-start gap-3 text-sm text-gray-700">
										<XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
										<p className="leading-snug">{text}</p>
									</div>
								))}
							</div>
						</div>

						{/* 5. Frequently asked questions */}
						<div className="space-y-4 border-b pb-6">
							<h3 className="text-xl font-bold text-gray-900">Frequently asked questions</h3>
							<div className="divide-y border-t border-b">
								{faqs.map((faq, idx) => (
									<div key={idx} className="py-3">
										<button
											onClick={() => toggleFaq(idx)}
											className="w-full flex justify-between items-center text-left text-sm font-semibold text-gray-800 hover:text-pink-600 transition-colors gap-2"
										>
											<span>{faq.question}</span>
											{openFaq === idx ? (
												<ChevronUp className="w-4 h-4 text-gray-500" />
											) : (
												<ChevronDown className="w-4 h-4 text-gray-500" />
											)}
										</button>
										{openFaq === idx && (
											<p className="text-xs text-gray-600 mt-2 leading-relaxed pl-1">
												{faq.answer}
											</p>
										)}
									</div>
								))}
							</div>
						</div>

						{/* 6. Rating Section */}
						<div className="space-y-4 border-b pb-6">
							<h3 className="text-xl font-bold text-gray-900">Rating</h3>
							<div className="flex items-center gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
								<div className="text-center border-r pr-6">
									<div className="text-3xl font-extrabold text-gray-900">
										{professional?.rating || "4.83"}
									</div>
									<div className="flex items-center justify-center text-amber-400 my-1">
										<Star className="w-4 h-4 fill-amber-400" />
										<Star className="w-4 h-4 fill-amber-400" />
										<Star className="w-4 h-4 fill-amber-400" />
										<Star className="w-4 h-4 fill-amber-400" />
										<Star className="w-4 h-4 fill-amber-400" />
									</div>
									<div className="text-xs text-gray-500">182K ratings</div>
								</div>
								<div className="flex-1 space-y-1.5 text-xs text-gray-600">
									<div className="flex items-center gap-2">
										<span>5 ★</span>
										<div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
											<div className="bg-amber-400 h-full w-[85%] rounded-full" />
										</div>
										<span>85%</span>
									</div>
									<div className="flex items-center gap-2">
										<span>4 ★</span>
										<div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
											<div className="bg-amber-400 h-full w-[10%]" />
										</div>
										<span>10%</span>
									</div>
									<div className="flex items-center gap-2">
										<span>3 ★</span>
										<div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
											<div className="bg-amber-400 h-full w-[3%]" />
										</div>
										<span>3%</span>
									</div>
								</div>
							</div>
						</div>

						{/* 7. All Reviews */}
						<div className="space-y-4">
							<h3 className="text-xl font-bold text-gray-900">All reviews</h3>
							<div className="space-y-3">
								{reviews.map((rev) => (
									<div key={rev.id} className="p-4 rounded-xl border bg-gray-50 space-y-1.5">
										<div className="flex justify-between items-center">
											<span className="text-sm font-bold text-gray-900">{rev.name}</span>
											<span className="text-xs text-gray-400">{rev.date}</span>
										</div>
										<div className="flex items-center text-amber-400 gap-0.5">
											{[...Array(rev.rating)].map((_, i) => (
												<Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
											))}
										</div>
										<p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
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
