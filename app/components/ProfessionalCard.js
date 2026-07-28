"use client";

import { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
// import { useMutation } from "@tanstack/react-query";
// import { bookService } from "../../lib/api";
// import { apiRequest } from "@/utils/api";
// import { getCookie } from "@/utils/customCookie";
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
		<div className="w-full relative">
			<div className="flex items-start gap-4 border rounded-2xl p-4 shadow-sm bg-white mb-3">
				<div className="flex flex-col flex-1">
					<div className="flex justify-between items-start">
						<h3 className="text-base font-semibold text-gray-800">
							{professional.name}
						</h3>
						<div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md">
							<Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
							<span className="ml-1 text-sm font-medium text-gray-700">
								{professional.rating}
							</span>
						</div>
					</div>

					<p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
						<span className="truncate">{professional.address}</span>
					</p>

					<div className="flex justify-between items-end mt-3 gap-2">
						<ViewDetailsButton
							professional={professional}
							subCategory={subCategory}
							details={details}
							price={price}
						/>
						<div className="flex flex-col items-end">
							<p className="text-sm font-semibold text-pink-600">
								₹{price} / hour
							</p>
							<button
								onClick={handleBookNow}
								className="mt-1 px-3 py-1.5 text-sm rounded-lg bg-pink-500 text-white"
							>
								Book Now
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

