// src/pages/AllContests/AllContests.jsx
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import ContestCard from "../../components/contests/ContestCard";

const CONTEST_TYPES = [
    "All",
    "Image Design",
    "Logo Design",
    "Article Writing",
    "Business Idea",
    "Game Review",
    "Photography",
    "Other",
];

const AllContests = () => {
    const axiosPublic = useAxiosPublic();
    const [searchParams, setSearchParams] = useSearchParams();

    const initialSearch = searchParams.get("search") || "";
    const initialType = searchParams.get("type") || "All";

    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [activeType, setActiveType] = useState(initialType);

    const {
        data: contests = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["all-contests", searchTerm, activeType],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (searchTerm) params.append("search", searchTerm);
            if (activeType !== "All") params.append("type", activeType);

            const res = await axiosPublic.get(`/contests?${params.toString()}`);
            return res.data;
        },
    });

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const trimmed = searchTerm.trim();
        const params = new URLSearchParams();
        if (trimmed) params.set("search", trimmed);
        if (activeType && activeType !== "All") params.set("type", activeType);
        setSearchParams(params);
    };

    const handleTypeChange = (type) => {
        setActiveType(type);
        const params = new URLSearchParams();
        if (searchTerm.trim()) params.set("search", searchTerm.trim());
        if (type !== "All") params.set("type", type);
        setSearchParams(params);
    };

    return (
        <section className="space-y-6">
            {/* Header + search */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-base-content">
                        All contests
                    </h2>
                    <p className="text-sm text-base-content/70 max-w-2xl">
                        Browse all contests approved by admins. Use the category tabs and
                        search box to find contests that match your skills and interests.
                    </p>
                </div>

                <form
                    onSubmit={handleSearchSubmit}
                    className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto"
                >
                    <input
                        type="text"
                        value={searchTerm}
                        placeholder="Search by contest name or type"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input input-bordered input-sm sm:input-md w-full sm:w-64"
                    />
                    <button
                        type="submit"
                        className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Tabs by contest type */}
            <div className="flex flex-wrap gap-2 border-b border-base-300 pb-2">
                {CONTEST_TYPES.map((type) => (
                    <button
                        key={type}
                        type="button"
                        onClick={() => handleTypeChange(type)}
                        className={`px-3 py-1 rounded-full text-xs md:text-sm border transition-colors ${activeType === type
                                ? "bg-primary text-primary-content border-primary"
                                : "bg-base-100 text-base-content/70 border-base-300 hover:bg-base-200"
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Content */}
            {isLoading && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="animate-pulse rounded-2xl bg-base-100 border border-base-300 p-4 space-y-3"
                        >
                            <div className="h-32 rounded-xl bg-base-300" />
                            <div className="h-4 w-2/3 bg-base-300 rounded" />
                            <div className="h-3 w-full bg-base-300 rounded" />
                            <div className="h-3 w-1/2 bg-base-300 rounded" />
                            <div className="flex justify-between pt-2">
                                <div className="h-7 w-20 bg-base-300 rounded-full" />
                                <div className="h-7 w-16 bg-base-300 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && isError && (
                <p className="text-error text-sm">
                    Unable to load contests right now. Please try again later.
                </p>
            )}

            {!isLoading && !isError && contests.length === 0 && (
                <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-6 text-sm text-base-content/70">
                    No contests found for this filter. Try changing the category or search
                    term.
                </div>
            )}

            {!isLoading && !isError && contests.length > 0 && (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {contests.map((contest) => (
                        <ContestCard key={contest._id} contest={contest} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default AllContests;