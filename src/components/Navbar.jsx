import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
    const { user, logOut } = useAuth() || {};
    const [theme, setTheme] = useState(
        () => localStorage.getItem("contest-theme") || "light"
    );
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Apply theme to <html> for DaisyUI
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("contest-theme", theme);
    }, [theme]);

    const handleThemeToggle = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    const handleLogout = async () => {
        try {
            await logOut();
            // TODO: toast / SweetAlert
        } catch (err) {
            console.error(err);
            // TODO: error toast
        }
    };

    const navLinkClass = ({ isActive }) =>
        `px-2 py-1 text-sm font-medium transition-colors ${isActive
            ? "text-primary border-b-2 border-primary"
            : "text-base-content/70 hover:text-primary"
        }`;

    const navLinks = (
        <>
            <li>
                <NavLink to="/" className={navLinkClass}>
                    Home
                </NavLink>
            </li>
            <li>
                <NavLink to="/all-contests" className={navLinkClass}>
                    All Contests
                </NavLink>
            </li>
            <li>
                <NavLink to="/leaderboard" className={navLinkClass}>
                    Leaderboard
                </NavLink>
            </li>
            <li>
                <NavLink to="/about" className={navLinkClass}>
                    About
                </NavLink>
            </li>
            <li>
                <NavLink to="/how-it-works" className={navLinkClass}>
                    How It Works
                </NavLink>
            </li>
        </>
    );

    return (
        <header className="sticky top-0 z-50 bg-base-100/90 backdrop-blur border-b border-base-300">
            <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                {/* Left: brand */}
                <div className="flex items-center gap-2">
                    <Link
                        to="/"
                        className="text-xl sm:text-2xl font-black tracking-tight text-primary"
                    >
                        ContestHub
                    </Link>
                </div>

                {/* Desktop nav */}
                <ul className="hidden md:flex items-center gap-4">{navLinks}</ul>

                {/* Right section: theme + auth + mobile button */}
                <div className="flex items-center gap-2">
                    {/* Theme toggle */}
                    <button
                        onClick={handleThemeToggle}
                        className="btn btn-ghost btn-circle btn-xs sm:btn-sm"
                        aria-label="Toggle theme"
                    >
                        {theme === "light" ? (
                            // Moon icon
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.8}
                                    d="M20.354 15.354A9 9 0 018.646 3.646 7 7 0 1019 16a6.97 6.97 0 01-1.354-.646z"
                                />
                            </svg>
                        ) : (
                            // Sun icon
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.8}
                                    d="M12 3v2.25M18.364 5.636l-1.59 1.59M21 12h-2.25M18.364 18.364l-1.59-1.59M12 18.75V21M7.227 16.773l-1.59 1.59M5.25 12H3M7.227 7.227l-1.59-1.59M12 8.25A3.75 3.75 0 1112 15.75 3.75 3.75 0 0112 8.25z"
                                />
                            </svg>
                        )}
                    </button>

                    {/* Auth controls (desktop + tablet) */}
                    <div className="hidden sm:flex items-center gap-2 text-sm">
                        {user ? (
                            <div className="dropdown dropdown-end">
                                <label tabIndex={0} className="btn btn-ghost btn-sm gap-2">
                                    <img
                                        src={
                                            user?.photoURL ||
                                            "https://i.ibb.co/YfGbxwG/default-avatar.png"
                                        }
                                        alt={user?.displayName || "User"}
                                        className="w-8 h-8 rounded-full object-cover border border-base-300"
                                    />
                                    <span className="max-w-[100px] truncate text-xs">
                                        {user?.displayName || "User"}
                                    </span>
                                </label>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                                >
                                    <li className="menu-title text-xs">
                                        <span>Signed in as</span>
                                    </li>
                                    <li className="px-2 pb-1 text-xs truncate text-base-content/80">
                                        {user?.displayName || user?.email}
                                    </li>
                                    <li>
                                        <Link to="/dashboard">Dashboard</Link>
                                    </li>
                                    <li>
                                        <button onClick={handleLogout} className="text-error">
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-ghost btn-sm">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary btn-sm">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden btn btn-ghost btn-circle btn-sm"
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        aria-label="Open menu"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {isMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.8}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.8}
                                    d="M4 6h16M4 12h12M4 18h8"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Mobile dropdown menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-base-300 bg-base-100">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3">
                        <ul className="flex flex-col gap-2">{navLinks}</ul>

                        <div className="flex items-center justify-between pt-3 border-t border-base-300">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={
                                                user?.photoURL ||
                                                "https://i.ibb.co/YfGbxwG/default-avatar.png"
                                            }
                                            alt={user?.displayName || "User"}
                                            className="w-8 h-8 rounded-full object-cover border border-base-300"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">
                                                {user?.displayName || "User"}
                                            </span>
                                            <span className="text-xs text-base-content/70 truncate max-w-[160px]">
                                                {user?.email}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="btn btn-outline btn-xs text-error border-error"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex gap-2 w-full">
                                    <Link
                                        to="/login"
                                        className="btn btn-ghost btn-sm flex-1"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="btn btn-primary btn-sm flex-1"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;