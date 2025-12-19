import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyParticipatedContests = () => {
    const axiosSecure = useAxiosSecure();

    const {
        data: participations = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["my-participated-contests"],
        queryFn: async () => {
            const res = await axiosSecure.get("/payments/my");
            return res.data;
        },
    });

    const now = new Date();

    // Sort by upcoming deadline:
    // 1) future deadlines first (closest first)
    // 2) then past deadlines (closest to now first)
    const sortedParticipations = [...participations].sort((a, b) => {
        const da = a.contest?.deadline ? new Date(a.contest.deadline) : new Date(0);
        const db = b.contest?.deadline ? new Date(b.contest.deadline) : new Date(0);

        const aFuture = da.getTime() >= now.getTime() ? 0 : 1;
        const bFuture = db.getTime() >= now.getTime() ? 0 : 1;

        if (aFuture !== bFuture) return aFuture - bFuture; // future first
        return da - db; // earlier deadline first
    });

    if (isLoading) {
        return (
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-base-content">
                    My participated contests
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
                    My participated contests
                </h2>
                <p className="text-sm text-error">
                    Failed to load your participated contests. Please refresh the page.
                </p>
            </section>
        );
    }

    return (
        <section className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-base-content">
                        My participated contests
                    </h2>
                    <p className="text-sm text-base-content/70">
                        These are contests you have joined after successful payment,
                        sorted by upcoming deadlines.
                    </p>
                </div>
                <p className="text-xs text-base-content/60">
                    Total participated:{" "}
                    <span className="font-semibold">{participations.length}</span>
                </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-100">
                <table className="table table-xs md:table-sm lg:table-md">
                    <thead>
                        <tr className="text-xs md:text-sm text-base-content/70">
                            <th>#</th>
                            <th>Contest</th>
                            <th className="hidden md:table-cell">Type</th>
                            <th>Deadline</th>
                            <th>Entry fee</th>
                            <th>Payment</th>
                            <th className="hidden md:table-cell">Prize</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedParticipations.map((p, idx) => {
                            const contest = p.contest || {};
                            const deadline = contest.deadline
                                ? new Date(contest.deadline)
                                : null;
                            const isEnded =
                                deadline && deadline.getTime() < now.getTime();
                            const paymentStatus = (p.paymentStatus || "paid").toLowerCase();

                            const paymentBadgeClass =
                                paymentStatus === "paid"
                                    ? "badge-success"
                                    : paymentStatus === "pending"
                                        ? "badge-warning"
                                        : paymentStatus === "refunded"
                                            ? "badge-info"
                                            : "badge-ghost";

                            return (
                                <tr key={p._id} className="text-xs md:text-sm">
                                    <td>{idx + 1}</td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className="avatar hidden sm:inline-flex">
                                                <div className="w-9 h-9 rounded-lg border border-base-300">
                                                    <img
                                                        src={
                                                            contest.image ||
                                                            "https://via.placeholder.com/80x80?text=Contest"
                                                        }
                                                        alt={contest.name || "Contest"}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-medium text-base-content line-clamp-2">
                                                    {contest.name || contest.title || "Contest"}
                                                </p>
                                                <p className="text-[11px] text-base-content/60">
                                                    Joined on{" "}
                                                    {p.paidAt
                                                        ? new Date(p.paidAt).toLocaleDateString()
                                                        : "Unknown"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="hidden md:table-cell capitalize">
                                        {contest.type || "N/A"}
                                    </td>
                                    <td>
                                        <span className="text-xs">
                                            {deadline
                                                ? deadline.toLocaleDateString()
                                                : "Not set"}
                                        </span>
                                        <span
                                            className={`ml-1 text-[10px] ${isEnded
                                                ? "text-error"
                                                : "text-success"
                                                }`}
                                        >
                                            {deadline
                                                ? isEnded
                                                    ? "(Ended)"
                                                    : "(Upcoming)"
                                                : ""}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="text-xs">
                                            $
                                            {contest.price
                                                ? contest.price.toFixed(2)
                                                : p.amount
                                                    ? p.amount.toFixed(2)
                                                    : "0.00"}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            className={`badge badge-xs md:badge-sm capitalize ${paymentBadgeClass}`}
                                        >
                                            {paymentStatus}
                                        </span>
                                    </td>
                                    <td className="hidden md:table-cell">
                                        <span className="text-xs">
                                            {typeof contest.prizeMoney === "number"
                                                ? `$${contest.prizeMoney.toFixed(2)}`
                                                : "N/A"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex justify-center">
                                            {contest._id ? (
                                                <Link
                                                    to={`/contests/${contest._id}`}
                                                    className="btn btn-xs btn-outline text-xs"
                                                >
                                                    View contest
                                                </Link>
                                            ) : (
                                                <span className="text-[11px] text-base-content/60">
                                                    Contest not available
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {sortedParticipations.length === 0 && (
                            <tr>
                                <td colSpan="8" className="text-center text-sm py-8">
                                    You haven’t joined any contests yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default MyParticipatedContests;