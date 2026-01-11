import { Link, NavLink, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";

const DashboardLayout = () => {
    const { user, logOut } = useAuth() || {};
    const { role, isAdmin, isCreator, isUser, isRoleLoading } = useUserRole();

    const handleLogout = async () => {
        try {
            await logOut();
        } catch (err) {
            console.error(err);
        }
    };

    const navLinkClass = ({ isActive }) =>
        `block px-3 py-2 rounded-lg text-sm transition-colors ${isActive
            ? "bg-primary text-primary-content font-semibold"
            : "text-base-content/80 hover:bg-base-200"
        }`;

    const roleDescription =
        role === "admin"
            ? "Platform admin · manage users and contests"
            : role === "creator"
                ? "Contest creator · host and manage contests"
                : "Participant · join contests and track your wins";

    return (
        <div className="drawer lg:drawer-open min-h-screen bg-base-200">
            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
            {/* Main content */}
            <div className="drawer-content flex flex-col">
                {/* Top bar */}
                <div className="w-full navbar bg-base-100/90 backdrop-blur border-b border-base-300 px-4">
                    <div className="flex-none lg:hidden">
                        <label
                            htmlFor="dashboard-drawer"
                            className="btn btn-ghost btn-square btn-sm"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.8}
                                    d="M4 6h16M4 12h12M4 18h8"
                                />
                            </svg>
                        </label>
                    </div>

                    <div className="flex-1">
                        <span className="font-semibold text-base-content mr-2">
                            Dashboard
                        </span>
                        <span className="badge badge-outline badge-sm capitalize">
                            {role}
                        </span>
                    </div>

                    <div className="flex-none flex items-center gap-2">
                        {user && (
                            <>
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs font-medium text-base-content">
                                        {user.displayName || "User"}
                                    </p>
                                    <p className="text-[11px] text-base-content/60 max-w-40 truncate">
                                        {user.email}
                                    </p>
                                </div>
                                <div className="dropdown dropdown-end">
                                    <label tabIndex={0} className="btn btn-ghost btn-circle btn-sm">
                                        <div className="avatar">
                                            <div className="w-9 rounded-full border border-base-300">
                                                <img
                                                    src={
                                                        user.photoURL ||
                                                        "https://i.ibb.co/YfGbxwG/default-avatar.png"
                                                    }
                                                    alt={user.displayName || "User"}
                                                />
                                            </div>
                                        </div>
                                    </label>
                                    <ul
                                        tabIndex={0}
                                        className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow bg-base-100 rounded-box w-48"
                                    >
                                        <li className="menu-title text-[11px]">
                                            <span>Role: {role}</span>
                                        </li>
                                        <li>
                                            <Link to="/">Back to home</Link>
                                        </li>
                                        <li>
                                            <button onClick={handleLogout} className="text-error">
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Outlet content */}
                <main className="flex-1 p-4 md:p-6">
                    <Outlet />
                </main>
            </div>

            {/* Sidebar */}
            <div className="drawer-side">
                <label htmlFor="dashboard-drawer" className="drawer-overlay" />
                <aside className="w-72 bg-base-100 border-r border-base-300 flex flex-col">
                    {/* Brand */}
                    <div className="px-4 py-4 border-b border-base-300">
                        <Link
                            to="/"
                            className="text-xl font-black tracking-tight text-primary"
                        >
                            ContestHub
                        </Link>
                        <p className="text-xs text-base-content/70 mt-1">{roleDescription}</p>
                    </div>

                    {/* Menus */}
                    <nav className="flex-1 px-3 py-4 space-y-5 text-sm overflow-y-auto">
                        {isRoleLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <span className="loading loading-spinner loading-sm text-primary" />
                            </div>
                        ) : (
                            <>
                                {/* Participant / Normal user menu */}
                                {(isUser || isCreator || isAdmin) && (
                                    <div>
                                        <p className="px-3 mb-1 text-[11px] uppercase tracking-wide text-base-content/60">
                                            Participant
                                        </p>
                                        <ul className="space-y-1">
                                            <li>
                                                <NavLink
                                                    to="/dashboard/user/participated"
                                                    className={navLinkClass}
                                                >
                                                    My participated contests
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink
                                                    to="/dashboard/user/wins"
                                                    className={navLinkClass}
                                                >
                                                    My winning contests
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink
                                                    to="/dashboard/user/profile"
                                                    className={navLinkClass}
                                                >
                                                    My profile
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </div>
                                )}

                                {/* Creator menu */}
                                {isCreator && (
                                    <div>
                                        <p className="px-3 mt-4 mb-1 text-[11px] uppercase tracking-wide text-base-content/60">
                                            Contest creator
                                        </p>
                                        <ul className="space-y-1">
                                            <li>
                                                <NavLink
                                                    to="/dashboard/creator/add-contest"
                                                    className={navLinkClass}
                                                >
                                                    Add new contest
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink
                                                    to="/dashboard/creator/my-contests"
                                                    className={navLinkClass}
                                                >
                                                    My created contests
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/dashboard" end className={navLinkClass}>
                                                    Creator overview
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </div>
                                )}

                                {/* Admin menu */}
                                {isAdmin && (
                                    <div>
                                        <p className="px-3 mt-4 mb-1 text-[11px] uppercase tracking-wide text-base-content/60">
                                            Admin
                                        </p>
                                        <ul className="space-y-1">
                                            <li>
                                                <NavLink
                                                    to="/dashboard/admin/manage-users"
                                                    className={navLinkClass}
                                                >
                                                    Manage users
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink
                                                    to="/dashboard/admin/manage-contests"
                                                    className={navLinkClass}
                                                >
                                                    Manage contests
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/dashboard" end className={navLinkClass}>
                                                    Platform overview
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </>
                        )}
                    </nav>

                    {/* Bottom link */}
                    <div className="px-4 py-4 border-t border-base-300">
                        <Link to="/" className="btn btn-ghost btn-sm w-full justify-start">
                            ← Back to home
                        </Link>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default DashboardLayout;