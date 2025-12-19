import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Main = () => {
    return (
        <div>
            <Navbar />
            <div className="min-h-[calc(100vh-68px)]">
                {/* Outlet renders the child route's element */}
                <Outlet />
            </div>
            <footer className="footer footer-center p-4 bg-base-300 text-base-content">
                <aside>
                    <p>Copyright © 2025 ContestHub - All right reserved</p>
                </aside>
            </footer>
        </div>
    );
};

export default Main;