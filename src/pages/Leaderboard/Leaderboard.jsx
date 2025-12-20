import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const Leaderboard = () => {
    const axiosPublic = useAxiosPublic();

    const {
        data: leaders = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["leaderboard"],
        queryFn: async () => {
            const res = await axiosPublic.get("/leaderboard");
            return res.data; // [{ email, name, photoURL, role, wins, totalPrize }]
        },
    });

    if (isLoading) {
        return (
            <section className="min-h-50 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary" />
            </section>
        );
    }

    if (isError) {
        return (
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-base-content">
                    Leaderboard
                </h2>
                <p className="text-sm text-error">
                    Unable to load the leaderboard right now. Please try again later.
                </p>
            </section>
        );
    }

    return (
        <section className="space-y-8" data-aos="fade-up">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-base-content">
                        Leaderboard
                    </h2>
                    <p className="text-sm text-base-content/70 max-w-2xl">
                        Top participants ranked by the number of contests they have won.
                        Wins are based on contests where they were officially declared the
                        winner.
                    </p>
                </div>
                <p className="text-xs text-base-content/60">
                    Total winners listed:{" "}
                    <span className="font-semibold">{leaders.length}</span>
                </p>
            </div>

            {leaders.length === 0 ? (
                <div className="rounded-2xl bg-base-100 border border-dashed border-base-300 p-6 text-sm text-base-content/70">
                    No winners have been recorded yet. As contests finish and winners are
                    declared, they will appear here.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-100">
                    <table className="table table-xs md:table-sm lg:table-md">
                        <thead>
                            <tr className="text-xs md:text-sm text-base-content/70">
                                <th>#</th>
                                <th>Participant</th>
                                <th className="hidden md:table-cell">Role</th>
                                <th>Wins</th>
                                <th>Total prize</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaders.map((u, index) => (
                                <tr key={u.email} className="text-xs md:text-sm">
                                    <td>
                                        <RankBadge rank={index + 1} />
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className="avatar">
                                                <div className="w-8 h-8 rounded-full border border-base-300">
                                                    <img
                                                        src={
                                                            u.photoURL ||
                                                            "https://i.ibb.co/YfGbxwG/default-avatar.png"
                                                        }
                                                        alt={u.name || u.email}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-medium text-base-content">
                                                    {u.name || "Participant"}
                                                </p>
                                                <p className="text-[11px] text-base-content/60">
                                                    {u.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="hidden md:table-cell capitalize">
                                        {u.role || "user"}
                                    </td>
                                    <td>
                                        <span className="font-semibold">{u.wins}</span>
                                    </td>
                                    <td>
                                        <span className="text-xs">
                                            ${Number(u.totalPrize || 0).toFixed(2)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default Leaderboard;

/* ---------- Rank badge component ---------- */

const RankBadge = ({ rank }) => {
    if (rank === 1) {
        return (
            <span className="badge badge-warning badge-sm font-semibold">
                1st
            </span>
        );
    }
    if (rank === 2) {
        return (
            <span className="badge badge-neutral badge-sm font-semibold">
                2nd
            </span>
        );
    }
    if (rank === 3) {
        return (
            <span className="badge badge-accent badge-sm font-semibold">
                3rd
            </span>
        );
    }
    return <span className="text-xs text-base-content/70">{rank}</span>;
};