"use client";

import { useState, useEffect } from "react";
import CategoryTabs from "./components/CategoryTabs";
import SubCategoryTabs from "./components/SubCategoryTabs";
import ProfessionalCard from "./components/ProfessionalCard";
import ProfessionalCardSkeleton from "./components/skeletons/ProfessionalCardSkeleton";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import { Search, Zap } from "lucide-react";
import { API_BASE_URL, apiFetch } from "@/lib/api";

export default function HomePage() {
	const [category, setCategory] = useState("Electrician");
	const [subCategory, setSubCategory] = useState("consult");

	const [workers, setWorkers] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		async function fetchWorkers() {
			if (!subCategory) {
				setWorkers([]);
				return;
			}

			setIsLoading(true);
			try {
				const response = await apiFetch(
					`${API_BASE_URL}/workers?sub_category=${encodeURIComponent(subCategory)}`
				);
				if (response.ok) {
					const data = await response.json();
					setWorkers(data.workers || data || []);
				} else {
					setWorkers([]);
				}
			} catch (error) {
				console.error("Failed to fetch workers:", error);
				setWorkers([]);
			} finally {
				setIsLoading(false);
			}
		}

		fetchWorkers();
	}, [subCategory]);

	return (
		<div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
			{/* Top Header */}
			<Header />

			{/* Main Content Area */}
			<main className="flex-1 pb-16">
				{/* Category Selector */}
				<CategoryTabs
					value={category}
					onChange={(val) => {
						setCategory(val);
						setSubCategory("");
					}}
				/>

				{/* Sub Category Selector */}
				{category && (
					<SubCategoryTabs
						value={subCategory}
						onChange={setSubCategory}
						category={category}
					/>
				)}

				{/* Workers Grid Section */}
				<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 w-full">
					
					{/* Section Title */}
					<div className="flex items-center justify-between mb-6">
						<div>
							<h2 className="text-xl font-bold text-slate-900 tracking-tight">
								Available Professionals
							</h2>
							<p className="text-xs text-slate-500 mt-0.5">
								Showing active specialists in your area
							</p>
						</div>

						{workers.length > 0 && (
							<span className="text-xs font-semibold px-3 py-1 rounded-sm bg-slate-200/80 text-slate-700">
								{workers.length} Experts Available
							</span>
						)}
					</div>

					{!subCategory && (
						<div className="text-center py-16 bg-white rounded-md border border-slate-200/80 shadow-2xs space-y-3">
							<div className="w-12 h-12 rounded-sm bg-[#fff4ed] text-[#ff8a4c] flex items-center justify-center mx-auto">
								<Zap size={24} />
							</div>
							<h3 className="text-base font-bold text-slate-900">Select a Service Option</h3>
							<p className="text-xs text-slate-500 max-w-sm mx-auto">
								Please choose a service option from the categories above to view available technicians.
							</p>
						</div>
					)}

					{subCategory && isLoading && (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{Array.from({ length: 3 }).map((_, index) => (
								<ProfessionalCardSkeleton key={index} />
							))}
						</div>
					)}

					{subCategory && !isLoading && workers?.length === 0 && (
						<div className="text-center py-16 px-4 rounded-md border border-slate-200/80 bg-white shadow-2xs space-y-3">
							<div className="w-12 h-12 rounded-sm bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
								<Search size={24} />
							</div>
							<p className="text-base font-bold text-slate-900">No professionals found</p>
							<p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
								There are currently no active workers registered under this specific service option in your immediate area right now.
							</p>
						</div>
					)}

					{!isLoading && workers && workers.length > 0 && (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{workers.map((worker) => (
								<ProfessionalCard
									key={worker.id}
									professional={worker}
									subCategory={subCategory}
								/>
							))}
						</div>
					)}
				</section>
			</main>

			<BottomNav />
		</div>
	);
}
