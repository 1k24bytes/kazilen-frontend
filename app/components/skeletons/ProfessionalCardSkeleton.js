export default function ProfessionalCardSkeleton() {
	return (
		<div className="w-full relative animate-pulse">
			<div className="flex items-start gap-4 border border-gray-100 rounded-2xl p-4 shadow-sm bg-white mb-3">
				<div className="flex flex-col flex-1">
					{/* Name & Rating Skeleton */}
					<div className="flex justify-between items-start">
						<div className="h-5 bg-gray-200 rounded w-1/3"></div>
						<div className="h-6 bg-gray-200 rounded-md w-14"></div>
					</div>

					{/* Address Skeleton */}
					<div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>

					{/* Details & Price/Book Action Skeleton */}
					<div className="flex justify-between items-end mt-4 gap-2">
						<div className="h-8 bg-gray-200 rounded-lg w-28"></div>
						<div className="flex flex-col items-end gap-1.5">
							<div className="h-4 bg-gray-200 rounded w-20"></div>
							<div className="h-8 bg-gray-200 rounded-lg w-24"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
