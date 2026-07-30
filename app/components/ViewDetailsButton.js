"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, X, ChevronDown, ChevronUp, XCircle, User, ShieldCheck, CheckCircle2 } from "lucide-react";

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
				className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200 transition cursor-pointer"
			>
				View details
			</button>

			{/* Modal Overlay */}
			{showProfile && (
				<div 
					onClick={() => setShowProfile(false)}
					className="fixed inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs z-50 p-4"
				>
					<div 
						onClick={(e) => e.stopPropagation()}
						className="bg-white rounded-2xl border border-slate-200 w-full max-w-2xl sm:max-w-3xl max-h-[88vh] overflow-y-auto shadow-2xl relative p-6 sm:p-8 text-slate-900 space-y-6 animate-in fade-in zoom-in-95 duration-200"
					>
						{/* Header */}
						<div className="sticky -top-6 sm:-top-8 -mx-6 sm:-mx-8 px-6 sm:px-8 py-4 bg-white/95 backdrop-blur-md z-30 flex justify-between items-center border-b border-slate-100">
							<h3 className="font-bold text-slate-900 text-base sm:text-lg">Service & Technician Details</h3>
							<button
								onClick={() => setShowProfile(false)}
								className="w-9 h-9 rounded-xl hover:bg-slate-100 text-slate-500 flex items-center justify-center transition cursor-pointer"
								aria-label="Close modal"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						{/* Worker Header Card */}
						<div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
							<div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 flex items-center justify-center">
								{professional?.image ? (
									<Image
										src={professional.image}
										alt={professional.name}
										fill
										className="object-cover"
									/>
								) : (
									<User className="w-7 h-7 text-slate-400" />
								)}
							</div>
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2">
									<h3 className="text-base font-bold text-slate-900 truncate">
										{professional?.name || "Professional Worker"}
									</h3>
									<span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
										<ShieldCheck size={11} /> Verified
									</span>
								</div>
								
								<p className="text-xs text-slate-500 truncate mt-0.5">
									{professional?.address || "Nagpur, MH"}
								</p>

								<div className="flex items-center gap-2 mt-1.5">
									<div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#fff4ed] border border-[#ffd5be] text-[#ea580c] text-xs font-bold">
										<Star className="w-3.5 h-3.5 text-[#ff8a4c] fill-[#ff8a4c]" />
										<span>{professional?.rating || 4.83}</span>
									</div>
									<span className="text-xs text-slate-400">
										• 150+ jobs completed
									</span>
								</div>
							</div>
						</div>

						{/* Service Info & Rate */}
						<div className="border-b border-slate-100 pb-5">
							<div className="flex justify-between items-start gap-4">
								<div className="space-y-1">
									<h2 className="text-xl font-extrabold text-slate-900 leading-tight">
										{typeof subCategory === "string" ? subCategory : "Switch/socket repair & replacement"}
									</h2>
									<div className="flex items-center gap-2 text-xs text-slate-500">
										<Star className="w-4 h-4 text-amber-500 fill-amber-400" />
										<span className="font-bold text-slate-900">
											{professional?.rating || 4.83}
										</span>
										<span>(182 reviews)</span>
									</div>
									<p className="text-2xl font-black text-slate-900 mt-2">
										₹{price || 120} <span className="text-xs font-normal text-slate-500">/ hour</span>
									</p>
								</div>
							</div>
						</div>

						{/* Process */}
						<div className="space-y-4 border-b border-slate-100 pb-5">
							<h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">Our Process</h3>
							<div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
								{processSteps.map((item) => (
									<div key={item.step} className="relative flex items-start gap-3">
										<div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#ff8a4c] text-white flex items-center justify-center text-[10px] font-bold z-10 shadow-xs">
											{item.step}
										</div>
										<div className="pl-2">
											<h4 className="text-xs font-bold text-slate-900">
												{item.title}
											</h4>
											<p className="text-xs text-slate-500 mt-0.5 leading-normal">
												{item.desc}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Exclusions */}
						<div className="space-y-2 border-b border-slate-100 pb-5">
							<h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">What is excluded?</h3>
							<div className="space-y-2">
								{exclusions.map((text, idx) => (
									<div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
										<XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
										<p className="leading-normal">{text}</p>
									</div>
								))}
							</div>
						</div>

						{/* FAQs */}
						<div className="space-y-3 border-b border-slate-100 pb-5">
							<h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Frequently Asked Questions</h3>
							<div className="divide-y divide-slate-100 border-t border-b border-slate-100">
								{faqs.map((faq, idx) => (
									<div key={idx} className="py-3">
										<button
											onClick={() => toggleFaq(idx)}
											className="w-full flex justify-between items-center text-left text-xs font-bold text-slate-800 hover:text-[#ff8a4c] transition-colors gap-2 cursor-pointer"
										>
											<span>{faq.question}</span>
											{openFaq === idx ? (
												<ChevronUp className="w-4 h-4 text-slate-400" />
											) : (
												<ChevronDown className="w-4 h-4 text-slate-400" />
											)}
										</button>
										{openFaq === idx && (
											<p className="text-xs text-slate-500 mt-2 leading-relaxed pl-0.5">
												{faq.answer}
											</p>
										)}
									</div>
								))}
							</div>
						</div>

						{/* Reviews */}
						<div className="space-y-3">
							<h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Customer Reviews</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{reviews.map((rev) => (
									<div key={rev.id} className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-1.5">
										<div className="flex justify-between items-center">
											<span className="text-xs font-bold text-slate-900">{rev.name}</span>
											<span className="text-[10px] text-slate-400">{rev.date}</span>
										</div>
										<div className="flex items-center text-[#ff8a4c] gap-0.5">
											{[...Array(rev.rating)].map((_, i) => (
												<Star key={i} className="w-3 h-3 fill-[#ff8a4c]" />
											))}
										</div>
										<p className="text-xs text-slate-600 leading-normal">{rev.comment}</p>
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
