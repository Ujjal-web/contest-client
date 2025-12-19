// src/pages/Dashboard/Creator/MyContests.jsx
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useUserRole from "../../../hooks/useUserRole";

const MyContests = () => {
    const axiosSecure = useAxiosSecure();
    const { isCreator } = useUserRole();
    const navigate = useNavigate();

    const {
        data: contests = [],
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["creator-contests"],
        enabled: isCreator, // only fetch when user is creator
        queryFn: async () => {
            const res = await axiosSecure.get("/creator/contests");
            return res.data;
        },
    });

    const handleDelete = async (contest) => {
        const result = await Swal.fire({
            title: "Delete this contest?",
            text: `Only pending contests can be deleted. "${contest.name}" will be removed permanently.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#ef4444",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await axiosSecure.delete(
                `/creator/contests/${contest._id}`
            );

            if (res.data.deletedCount > 0) {
                await refetch();
                Swal.fire({
                    icon: "success",
                    title: "Contest deleted",
                    text: `"${contest.name}" has been removed.`,
                    timer: 1800,
                    showConfirmButton: false,
                });
            } else {
                Swal.fire({
                    icon: "info",
                    title: "Not deleted",
                    text:
                        "Contest could not be deleted. It might already be approved or not belong to you.",
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Delete failed",
                text: "Unable to delete contest. Please try again.",
            });
        }
    };

    if (!isCreator) {
        return (
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-base-content">
                    My created contests
                </h2>
                <p className="text-sm text-error">
                    You do not have creator permissions. Ask an admin to change your role
                    to Contest Creator.
                </p>
            </section>
        );
    }

    if (isLoading) {
        return (
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-base-content">
                    My created contests
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
                    My created contests
                </h2>
                <p className="text-sm text-error">
                    Failed to load your contests. Please refresh the page.
                </p>
            </section>
        );
    }

    return (
        <section className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-base-content">
                        My created contests
                    </h2>
                    <p className="text-sm text-base-content/70">
                        Here you can see all the contests you created. Pending contests can
                        still be edited or deleted. Approved or rejected contests are
                        locked.
                    </p>
                </div>
                <Link
                    to="/dashboard/creator/add-contest"
                    className="btn btn-primary btn-sm md:btn-md"
                >
                    + Add new contest
                </Link>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-100">
                <table className="table table-xs md:table-sm lg:table-md">
                    <thead>
                        <tr className="text-xs md:text-sm text-base-content/70">
                            <th>#</th>
                            <th>Contest</th>
                            <th className="hidden md:table-cell">Type</th>
                            <th>Price</th>
                            <th>Prize</th>
                            <th className="hidden md:table-cell">Participants</th>
                            <th>Status</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contests.map((contest, idx) => {
                            const status = contest.status || "pending";

                            const statusLabel =
                                status === "approved"
                                    ? "Confirmed"
                                    : status === "rejected"
                                        ? "Rejected"
                                        : "Pending";

                            const statusClass =
                                status === "approved"
                                    ? "badge-success"
                                    : status === "rejected"
                                        ? "badge-error"
                                        : "badge-warning";

                            const isPending = status === "pending";

                            return (
                                <tr key={contest._id} className="text-xs md:text-sm">
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
                                                        alt={contest.name || contest.title}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-medium text-base-content line-clamp-2">
                                                    {contest.name || contest.title || "Untitled contest"}
                                                </p>
                                                <p className="text-[11px] text-base-content/60">
                                                    Deadline:{" "}
                                                    {contest.deadline
                                                        ? new Date(contest.deadline).toLocaleDateString()
                                                        : "Not set"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="hidden md:table-cell capitalize">
                                        {contest.type || "N/A"}
                                    </td>
                                    <td>
                                        <span className="text-xs">
                                            ${contest.price ? contest.price.toFixed(2) : "0.00"}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="text-xs">
                                            {typeof contest.prizeMoney === "number"
                                                ? `$${contest.prizeMoney.toFixed(2)}`
                                                : "N/A"}
                                        </span>
                                    </td>
                                    <td className="hidden md:table-cell">
                                        <span className="text-xs">
                                            {contest.participationCount ?? 0}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            className={`badge badge-xs md:badge-sm capitalize ${statusClass}`}
                                        >
                                            {statusLabel}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex flex-wrap justify-center gap-1">
                                            {/* Edit (only pending) */}
                                            <button
                                                className="btn btn-xs btn-ghost border border-base-300 text-xs"
                                                disabled={!isPending}
                                                onClick={() =>
                                                    navigate(
                                                        `/dashboard/creator/edit/${contest._id}`
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            {/* Delete (only pending) */}
                                            <button
                                                className="btn btn-xs btn-error text-xs text-white"
                                                disabled={!isPending}
                                                onClick={() => handleDelete(contest)}
                                            >
                                                Delete
                                            </button>

                                            {/* See submissions (always visible) */}
                                            <Link
                                                to={`/dashboard/creator/submissions/${contest._id}`}
                                                className="btn btn-xs btn-outline text-xs"
                                            >
                                                See submissions
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {contests.length === 0 && (
                            <tr>
                                <td colSpan="8" className="text-center text-sm py-8">
                                    You haven’t created any contests yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default MyContests;