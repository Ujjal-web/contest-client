import { Link, NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
const Navbar = () => {
    const { user, logOut } = useAuth();

    const handleLogOut = () => {
        logOut()
            .then(() => { })
            .catch((error) => console.log(error));
    };

    // Navigation Links (Reused for Mobile & Desktop)
    const navOptions = (
        <>
            <li>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? "text-primary font-bold border-b-2 border-primary" : "font-medium hover:text-primary"
                    }
                >
                    Home
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/all-contests"
                    className={({ isActive }) =>
                        isActive ? "text-primary font-bold border-b-2 border-primary" : "font-medium hover:text-primary"
                    }
                >
                    All Contests
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/extra"
                    className={({ isActive }) =>
                        isActive ? "text-primary font-bold border-b-2 border-primary" : "font-medium hover:text-primary"
                    }
                >
                    Extra Section
                </NavLink>
            </li>
        </>
    );

    return (
        <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50 px-4">
            {/* Navbar Start: Logo & Mobile Menu */}
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
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
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16"
                            />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 gap-2"
                    >
                        {navOptions}
                    </ul>
                </div>

                {/* Logo + Name */}
                <Link to="/" className="flex items-center gap-2">
                    <img src="/logo.png" alt="Logo" className="w-8 h-8 object-cover" />
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        ContestHub
                    </span>
                </Link>
            </div>

            {/* Navbar Center: Desktop Menu */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-6">
                    {navOptions}
                </ul>
            </div>

            {/* Navbar End: Auth Logic */}
            <div className="navbar-end">
                {user ? (
                    <div className="dropdown dropdown-end">
                        {/* Profile Picture Trigger */}
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border-2 border-primary">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="User Profile"
                                    src={user?.photoURL || "https://i.ibb.co/5GzXkwq/user.png"} // Fallback image
                                />
                            </div>
                        </div>

                        {/* Dropdown Content */}
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                        >
                            {/* Display Name (Non-clickable item styling) */}
                            <li className="menu-title text-black">
                                <span>{user?.displayName || "User"}</span>
                            </li>

                            <li>
                                <Link to="/dashboard">Dashboard</Link>
                            </li>

                            <li>
                                <button onClick={handleLogOut} className="text-error font-bold">
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <Link to="/login" className="btn btn-primary btn-sm text-white">
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;