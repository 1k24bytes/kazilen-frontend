"use client";

import { useState, useEffect } from "react";
import CategoryTabs from "./components/CategoryTabs";
import SubCategoryTabs from "./components/SubCategoryTabs";
import ProfessionalCard from "./components/ProfessionalCard";
import ProfessionalCardSkeleton from "./components/skeletons/ProfessionalCardSkeleton";
import Header from "./components/Header";

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
				// Simulating API call
				setTimeout(() => {
					setWorkers([]);
					setIsLoading(false);
				}, 600);
			} catch (error) {
				console.error("Failed to fetch workers:", error);
				setWorkers([]);
				setIsLoading(false);
			}
		}

		fetchWorkers();
	}, [subCategory]);

	return (
		<div className="min-h-screen bg-zinc-50/50 text-zinc-900 flex flex-col">
			<Header />
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
					<SubCategoryTabs value={subCategory} onChange={setSubCategory} />
				)}

				{/* Workers list section with max-w container & whitespace */}
				<section className="max-w-xl mx-auto px-4 pt-6 pb-8 w-full">
					{!subCategory && (
						<div className="text-center py-12 text-zinc-500 text-sm">
							Select a sub-category above to find available professionals.
						</div>
					)}

					{subCategory && isLoading && (
						<div className="space-y-4">
							{Array.from({ length: 3 }).map((_, index) => (
								<ProfessionalCardSkeleton key={index} />
							))}
						</div>
					)}

					{subCategory && !isLoading && workers?.length === 0 && (
						<div className="text-center py-12 px-4 rounded-lg border border-zinc-200/80 bg-white shadow-2xs space-y-2">
							<p className="text-sm font-semibold text-zinc-900">No professionals found</p>
							<p className="text-xs text-zinc-500 max-w-xs mx-auto">
								There are currently no active workers registered under this specific service option in your area.
							</p>
						</div>
					)}

					{!isLoading && workers && workers.length > 0 && (
						<div className="space-y-4">
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
		</div>
	);
}
