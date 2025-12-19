// src/pages/Dashboard/Admin/ManageContests.jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useUserRole from "../../../hooks/useUserRole";

const ITEMS_PER_PAGE = 10;

const ManageContests = () => {
    const axiosSecure = useAxiosSecure();
    const { isAdmin } = useUserRole();
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState(""); // all, pending, approved, rejected

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["admin-contests", page, statusFilter],
        enabled: isAdmin,
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append("page", page);
            params.append("limit", ITEMS_PER_PAGE);
            if (statusFilter) params.append("status", statusFilter);

            const res = await axiosSecure.get(`/admin/contests?${params.toString()}`);
            return res.data; // { contests, total, page, totalPages }
        },
    });

    const contests = data?.contests || [];
    const total = data?.total || 0;
    const totalPages = data?.totalPages || 1;

    const handleChangePage = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
    };

    const confirmAction = async (title, text, icon = "question") => {
        const result = await Swal.fire({
            title,
            text,
            icon,
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#3b82f6",
        });
        return result.isConfirmed;
    };

    const handleUpdateStatus = async (contest, newStatus) => {
        if (contest.status === newStatus) return;

        const confirmed = await confirmAction(
            "Update contest status?",
            `Change "${contest.name}" to ${newStatus.toUpperCase()}?`
        );
        if (!confirmed) return;

        try {
            const res = await axiosSecure.patch(
                `/admin/contests/${contest._id}/status`,
                { status: newStatus }
            );

            if (res.data.modifiedCount > 0) {
                await refetch();
                Swal.fire({
                    icon: "success",
                    title: "Status updated",
                    text: `Contest status set to ${newStatus.toUpperCase()}.`,
                    timer: 1800,
                    showConfirmButton: false,
                });
            } else {
                Swal.fire({
                    icon: "info",
                    title: "No change",
                    text: "The status was not updated.",
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Update failed",
                text: "Unable to update contest status. Please try again.",
            });
        }
    };

    const handleDeleteContest = async (contest) => {
        const confirmed = await confirmAction(
            "Delete this contest?",
            `This will permanently remove "${contest.name}" and its data. This action cannot be undone.`,
            "warning"
        );
        if (!confirmed) return;

        try {
            const res = await axiosSecure.delete(`/admin/contests/${contest._id}`);

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
                    text: "Contest was not deleted.",
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

    if (!isAdmin) {
        return (
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-base-content">
                    Manage contests
                </h2>
                <p className="text-sm text-error">
                    You do not have permission to view this page. Admin role is required.
                </p>
            </section>
        );
    }

    if (isLoading) {
        return (
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-base-content">
                    Manage contests
                </h2>
                <div className="min-h-[200px] flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg text-primary" />
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-base-content">
                    Manage contests
                </h2>
                <p className="text-sm text-error">
                    Failed to load contests. Please refresh the page.
                </p>
            </section>
        );
    }

    return (
        <section className="space-y-4">
            {/* Header & filters */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-base-content">
                        Manage contests
                    </h2>
                    <p className="text-sm text-base-content/70">
                        Review contests created by users. Confirm approved contests, reject
                        inappropriate ones, or delete if needed.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <p className="text-xs text-base-content/60">
                        Total contests: <span className="font-semibold">{total}</span>
                    </p>
                    <select
                        className="select select-bordered select-xs sm:select-sm max-w-xs"
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="">All statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Table */}
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
                        {contests.map((contest, idx) => (
                            <ContestRow
                                key={contest._id}
                                index={(page - 1) * ITEMS_PER_PAGE + idx + 1}
                                contest={contest}
                                onConfirm={() => handleUpdateStatus(contest, "approved")}
                                onReject={() => handleUpdateStatus(contest, "rejected")}
                                onDelete={() => handleDeleteContest(contest)}
                            />
                        ))}

                        {contests.length === 0 && (
                            <tr>
                                <td colSpan="8" className="text-center text-sm py-8">
                                    No contests found for this filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-2">
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
        </section>
    );
};

export default ManageContests;