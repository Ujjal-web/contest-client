import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import ContestCard from "../../components/contests/ContestCard";
import ContestCardSkeleton from "../../components/contests/ContestCardSkeleton";

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

const ITEMS_PER_PAGE = 9;

const AllContests = () => {
    const axiosPublic = useAxiosPublic();
    const [searchParams, setSearchParams] = useSearchParams();

    const initialSearch = searchParams.get("search") || "";
    const initialType = searchParams.get("type") || "All";
    const initialPage = parseInt(searchParams.get("page") || "1", 10);

    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [activeType, setActiveType] = useState(initialType);
    const [page, setPage] = useState(initialPage);

    // react-hook-form for search form
    const { register, handleSubmit, reset } = useForm({
        defaultValues: { search: initialSearch },
    });

    const {
        data,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["all-contests", searchTerm, activeType, page],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (searchTerm) params.append("search", searchTerm);
            if (activeType !== "All") params.append("type", activeType);
            params.append("page", page);
            params.append("limit", ITEMS_PER_PAGE);

            const res = await axiosPublic.get(`/contests?${params.toString()}`);
            return res.data; // { contests, total, page, totalPages }
        },
    });

    const contests = data?.contests || [];
    const total = data?.total || 0;
    const totalPages = data?.totalPages || 1;

    // handle search submit via react-hook-form
    const onSearchSubmit = (data) => {
        const trimmed = (data.search || "").trim();

        const params = new URLSearchParams();
        if (trimmed) params.set("search", trimmed);
        if (activeType && activeType !== "All") params.set("type", activeType);
        params.set("page", "1");

        setPage(1);
        setSearchTerm(trimmed);
        setSearchParams(params);
    };

    const handleTypeChange = (type) => {
        setActiveType(type);
        const params = new URLSearchParams();
        if (searchTerm.trim()) params.set("search", searchTerm.trim());
        if (type !== "All") params.set("type", type);
        params.set("page", "1");
        setPage(1);
        setSearchParams(params);
    };

    const handleChangePage = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
        const params = new URLSearchParams();
        if (searchTerm.trim()) params.set("search", searchTerm.trim());
        if (activeType !== "All") params.set("type", activeType);
        params.set("page", String(newPage));
        setSearchParams(params);
    };

    return (
        <section className="space-y-6" data-aos="fade-up">
            {/* Header + search */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div data-aos="fade-right" data-aos-delay="50">
                    <h2 className="text-2xl md:text-3xl font-bold text-base-content">
                        All contests
                    </h2>
                    <p className="text-sm text-base-content/70 max-w-2xl">
                        Browse all contests approved by admins. Use the category tabs and
                        search box to find contests that match your skills and interests.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSearchSubmit)}
                    className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto"
                    data-aos="fade-left"
                    data-aos-delay="80"
                >
                    <input
                        type="text"
                        placeholder="Search by contest name or type"
                        className="input input-bordered input-sm sm:input-md w-full sm:w-64"
                        {...register("search")}
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
            <div
                className="flex flex-wrap gap-2 border-b border-base-300 pb-2"
                data-aos="fade-up"
                data-aos-delay="120"
            >
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
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
                        <ContestCardSkeleton key={idx} />
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
                <>
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {contests.map((contest, idx) => (
                            <div
                                key={contest._id}
                                data-aos="fade-up"
                                data-aos-delay={idx * 40}
                            >
                                <ContestCard contest={contest} />
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-4">
                        <p className="text-xs text-base-content/60">
                            Showing{" "}
                            <span className="font-semibold">
                                {total === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1}
                            </span>{" "}
                            to{" "}
                            <span className="font-semibold">
                                {Math.min(page * ITEMS_PER_PAGE, total)}
                            </span>{" "}
                            of <span className="font-semibold">{total}</span> contests
                        </p>

                        <div className="join">
                            <button
                                className="join-item btn btn-xs"
                                onClick={() => handleChangePage(page - 1)}
                                disabled={page === 1}
                            >
                                «
                            </button>
                            {Array.from({ length: totalPages }).map((_, idx) => (
                                <button
                                    key={idx}
                                    className={`join-item btn btn-xs ${page === idx + 1 ? "btn-primary" : "btn-ghost"
                                        }`}
                                    onClick={() => handleChangePage(idx + 1)}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                            <button
                                className="join-item btn btn-xs"
                                onClick={() => handleChangePage(page + 1)}
                                disabled={page === totalPages}
                            >
                                »
                            </button>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
};

export default AllContests;