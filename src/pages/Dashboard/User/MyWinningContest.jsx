import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyWinningContest = () => {
    const axiosSecure = useAxiosSecure();

    const {
        data: wins = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["my-winning-contests"],
        queryFn: async () => {
            const res = await axiosSecure.get("/users/wins");
            return res.data;
        },
        refetchOnMount: true,
    });

    const totalPrize = wins.reduce(
        (sum, c) =>
            typeof c.prizeMoney === "number" ? sum + c.prizeMoney : sum,
        0
    );

    if (isLoading) {
        return (
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-base-content">
                    My winning contests
                </h2>
                <div className="min-h-50 flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg text-primary" />
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-base-content">
                    My winning contests
                </h2>
                <p className="text-sm text-error">
                    Failed to load your winning contests. Please refresh the page.
                </p>
            </section>
        );
    }

    return (
        <section className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-base-content">
                        My winning contests
                    </h2>
                    <p className="text-sm text-base-content/70">
                        A gallery of contests where you were declared the winner, along with
                        prize amounts and key details.
                    </p>
                </div>
                <div className="text-xs text-base-content/60 space-y-1 text-right">
                    <p>
                        Total wins:{" "}
                        <span className="font-semibold">{wins.length}</span>
                    </p>
                    <p>
                        Total prize money:{" "}
                        <span className="font-semibold">
                            ${totalPrize.toFixed(2)}
                        </span>
                    </p>
                </div>
            </div>

            {wins.length === 0 ? (
                <div className="rounded-2xl bg-base-100 border border-dashed border-base-300 p-6 text-sm text-base-content/70 text-center">
                    You haven’t won any contests yet. Join more contests and your wins
                    will appear here.
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {wins.map((contest) => (
                        <WinningContestCard key={contest._id} contest={contest} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default MyWinningContest;

/* ---------- Card component for a single winning contest ---------- */

const WinningContestCard = ({ contest }) => {
    const {
        _id,
        name,
        title,
        image,
        type,
        prizeMoney,
        deadline,
        winnerUserName,
    } = contest;

    const displayName = name || title || "Contest";
    const deadlineDate = deadline ? new Date(deadline) : null;

    return (
        <div className="rounded-2xl bg-base-100 border border-base-300 shadow-sm overflow-hidden flex flex-col">
            {image && (
                <div className="relative h-28 overflow-hidden">
                    <img
                        src={image}
                        alt={displayName}
                        className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                        <span className="badge badge-success gap-1 text-[10px]">
                            Winner
                        </span>
                    </div>
                </div>
            )}

            <div className="p-4 flex-1 flex flex-col gap-2 text-sm">
                <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-base-content line-clamp-2">
                        {displayName}
                    </p>
                    <span className="badge badge-outline badge-xs capitalize">
                        {type || "General"}
                    </span>
                </div>

                <p className="text-xs text-base-content/70">
                    You were declared the winner of this contest
                    {winnerUserName ? ` as ${winnerUserName}.` : "."}
                </p>

                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl bg-base-200 px-2 py-2">
                        <p className="text-[11px] text-base-content/60">
                            Prize money
                        </p>
                        <p className="font-semibold text-base-content">
                            {typeof prizeMoney === "number"
                                ? `$${prizeMoney.toFixed(2)}`
                                : "Not set"}
                        </p>
                    </div>
                    <div className="rounded-xl bg-base-200 px-2 py-2">
                        <p className="text-[11px] text-base-content/60">
                            Contest deadline
                        </p>
                        <p className="font-semibold text-base-content">
                            {deadlineDate
                                ? deadlineDate.toLocaleDateString()
                                : "Not set"}
                        </p>
                    </div>
                </div>

                <div className="mt-3 flex justify-between items-center text-[11px] text-base-content/60">
                    <p>Celebrate this win on your profile and portfolio.</p>
                    <Link
                        to={`/contests/${_id}`}
                        className="btn btn-xs btn-outline text-[11px]"
                    >
                        View contest
                    </Link>
                </div>
            </div>
        </div>
    );
};