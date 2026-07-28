"use client";

import { useState, useEffect } from "react";
import CategoryTabs from "./components/CategoryTabs";
import SubCategoryTabs from "./components/SubCategoryTabs";
import ProfessionalCard from "./components/ProfessionalCard";
import ProfessionalCardSkeleton from "./components/skeletons/ProfessionalCardSkeleton";
import Header from "./components/Header";
// import { apiRequest } from "@/utils/api";
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
				// Simulating API call instead of using broken backend
				setTimeout(() => {
					setWorkers([]);
					setIsLoading(false);
				}, 800);
			} catch (error) {
				console.error("Failed to fetch workers:", error);
				setWorkers([]);
				setIsLoading(false);
			}
		}

		fetchWorkers();
	}, [subCategory]);

	return (
		<>
			<Header />
			<main className="min-h-screen bg-gray-50 pb-20">
				{/* Category */}
				<CategoryTabs
					value={category}
					onChange={(val) => {
						setCategory(val);
						setSubCategory("");
					}}
				/>

				{/* Sub Category */}
				{category && (
					<SubCategoryTabs value={subCategory} onChange={setSubCategory} />
				)}

				{/* Workers list */}
				<section className="px-4 mt-6 text-center text-gray-500">
					{category && !subCategory && "Select a sub-category"}

				{subCategory && isLoading && (
					<div className="space-y-3">
						{Array.from({ length: 4 }).map((_, index) => (
							<ProfessionalCardSkeleton key={index} />
						))}
					</div>
				)}

				{subCategory && !isLoading && workers?.length === 0 && (
					<p className="mt-4 text-gray-400">
						No workers found for this category.
					</p>
				)}

				{/* Only render the container and map if workers exist */}
				{!isLoading && workers && workers.length > 0 && (
					<div className="space-y-4 text-left">
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
		</>
	);
}
