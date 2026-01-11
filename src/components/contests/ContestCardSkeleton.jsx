const ContestCardSkeleton = () => {
    return (
        <div className="card h-full bg-base-100 shadow-sm border border-base-300 rounded-2xl overflow-hidden flex flex-col animate-pulse">
            {/* Image placeholder */}
            <div className="h-32 bg-base-300 w-full" />

            <div className="card-body flex-1 space-y-2 p-2">
                {/* Badges placeholder */}
                <div className="flex items-center justify-between gap-2">
                    <div className="h-5 w-16 bg-base-300 rounded-full" />
                    <div className="h-5 w-20 bg-base-300 rounded-full" />
                </div>

                {/* Title placeholder */}
                <div className="h-7 w-3/4 bg-base-300 rounded" />

                {/* Description placeholder - 1 line */}
                <div className="space-y-1 pt-0">
                    <div className="h-5 w-full bg-base-300 rounded" />
                </div>

                {/* Meta info placeholder */}
                <div className="flex items-center justify-between pt-1 mt-auto">
                    <div className="h-5 w-20 bg-base-300 rounded" />
                    <div className="h-5 w-16 bg-base-300 rounded" />
                </div>

                {/* Button placeholder */}
                <div className="card-actions justify-end pt-2 mt-auto">
                    <div className="h-8 w-24 bg-base-300 rounded-lg" />
                </div>
            </div>
        </div>
    );
};

export default ContestCardSkeleton;
