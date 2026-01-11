import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import ContestCard from "../../components/contests/ContestCard";
import ContestCardSkeleton from "../../components/contests/ContestCardSkeleton";

const PopularContestsSection = () => {
    const axiosPublic = useAxiosPublic();

    const {
        data: contests = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["popular-contests"],
        queryFn: async () => {
            const res = await axiosPublic.get("/contests/popular");
            return res.data;
        },
    });

    return (
        <section className="space-y-6" data-aos="fade-up" data-aos-offset="120">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-base-content">
                        Popular contests
                    </h2>
                    <p className="text-sm text-base-content/70 max-w-xl">
                        Hand-picked contests with the highest participation. Join a crowded
                        challenge or use them as inspiration for your own contest ideas.
                    </p>
                </div>
                <Link to="/all-contests" className="btn btn-outline btn-sm md:btn-md">
                    View all contests
                </Link>
            </div>

            {isLoading && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <ContestCardSkeleton key={idx} />
                    ))}
                </div>
            )}

            {!isLoading && isError && (
                <p className="text-error text-sm">
                    Unable to load popular contests right now. Please try again later.
                </p>
            )}

            {!isLoading && !isError && contests.length === 0 && (
                <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-6 text-sm text-base-content/70">
                    There are no popular contests yet. Be the first one to create a
                    contest and bring participants together.
                </div>
            )}

            {!isLoading && !isError && contests.length > 0 && (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {contests.map((contest, idx) => (
                        <div
                            key={contest._id}
                            data-aos="zoom-in"
                            data-aos-delay={idx * 60}
                        >
                            <ContestCard contest={contest} />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default PopularContestsSection;