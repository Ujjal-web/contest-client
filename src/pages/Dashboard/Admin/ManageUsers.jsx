import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import useUserRole from "../../../hooks/useUserRole";

const ITEMS_PER_PAGE = 10;

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();
    const { user: authUser } = useAuth() || {};
    const { isAdmin } = useUserRole();
    const [currentPage, setCurrentPage] = useState(1);

    const {
        data: users = [],
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["all-users"],
        queryFn: async () => {
            const res = await axiosSecure.get("/users");
            return res.data;
        },
        enabled: isAdmin, // only fetch if admin
    });

    const totalUsers = users.length;
    const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE) || 1;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedUsers = users.slice(startIndex, endIndex);

    const handleChangePage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const handleChangeRole = async (targetUser, newRole) => {
        if (targetUser.role === newRole) return;

        const result = await Swal.fire({
            title: "Change role?",
            text: `Change ${targetUser.name || targetUser.email} to ${newRole.toUpperCase()}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, change",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#3b82f6",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await axiosSecure.patch(`/users/${targetUser._id}/role`, {
                role: newRole,
            });

            if (res.data.modifiedCount > 0) {
                await refetch();
                Swal.fire({
                    icon: "success",
                    title: "Role updated",
                    text: `${targetUser.email} is now ${newRole.toUpperCase()}.`,
                    timer: 1800,
                    showConfirmButton: false,
                });
            } else {
                Swal.fire({
                    icon: "info",
                    title: "No change",
                    text: "The role was not updated.",
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Update failed",
                text: "Unable to change role. Please try again.",
            });
        }
    };

    if (!isAdmin) {
        return (
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-base-content">
                    Manage users
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
                    Manage users
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
                    Manage users
                </h2>
                <p className="text-sm text-error">
                    Failed to load users. Please refresh the page.
                </p>
            </section>
        );
    }

    return (
        <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-base-content">
                        Manage users
                    </h2>
                    <p className="text-sm text-base-content/70">
                        View all users and change roles between User, Creator, and Admin.
                    </p>
                </div>
                <p className="text-xs text-base-content/60">
                    Total users: <span className="font-semibold">{totalUsers}</span>
                </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-100">
                <table className="table table-sm md:table-md">
                    <thead>
                        <tr className="text-xs md:text-sm text-base-content/70">
                            <th>#</th>
                            <th>User</th>
                            <th>Role</th>
                            <th className="text-center">Change role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.map((u, idx) => (
                            <tr key={u._id} className="text-xs md:text-sm">
                                <td>{startIndex + idx + 1}</td>
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
                                                {u.name || "Unnamed user"}
                                            </p>
                                            <p className="text-[11px] text-base-content/60">
                                                {u.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="badge badge-outline badge-sm capitalize">
                                        {u.role || "user"}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex flex-wrap justify-center gap-1">
                                        {/* Make User */}
                                        <button
                                            className="btn btn-xs btn-ghost border border-base-300"
                                            disabled={u.role === "user" || u.email === authUser?.email}
                                            onClick={() => handleChangeRole(u, "user")}
                                        >
                                            User
                                        </button>

                                        {/* Make Creator */}
                                        <button
                                            className="btn btn-xs btn-ghost border border-base-300"
                                            disabled={
                                                u.role === "creator" || u.email === authUser?.email
                                            }
                                            onClick={() => handleChangeRole(u, "creator")}
                                        >
                                            Creator
                                        </button>

                                        {/* Make Admin */}
                                        <button
                                            className="btn btn-xs btn-primary"
                                            disabled={
                                                u.role === "admin" || u.email === authUser?.email
                                            }
                                            onClick={() => handleChangeRole(u, "admin")}
                                        >
                                            Admin
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {paginatedUsers.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center text-sm py-8">
                                    No users found.
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
                        {totalUsers === 0 ? 0 : startIndex + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold">
                        {Math.min(endIndex, totalUsers)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold">{totalUsers}</span> users
                </p>

                <div className="join">
                    <button
                        className="join-item btn btn-xs"
                        onClick={() => handleChangePage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        «
                    </button>
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                            key={idx}
                            className={`join-item btn btn-xs ${currentPage === idx + 1 ? "btn-primary" : "btn-ghost"
                                }`}
                            onClick={() => handleChangePage(idx + 1)}
                        >
                            {idx + 1}
                        </button>
                    ))}
                    <button
                        className="join-item btn btn-xs"
                        onClick={() => handleChangePage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        »
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ManageUsers;