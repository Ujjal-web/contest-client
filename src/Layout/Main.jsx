import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Main = () => {
    return (
        <div className="min-h-screen flex flex-col bg-base-200">
            {/* Top navigation */}
            <Navbar />

            {/* Main content */}
            <main className="flex-1 w-full">
                <div className="max-w-7xl mx-auto w-full px-4 py-6">
                    <Outlet />
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-8 border-t border-base-300 bg-base-200">
                <div className="footer footer-center p-4 text-base-content">
                    <aside>
                        <p>Copyright © 2025 ContestHub - All rights reserved</p>
                    </aside>
                </div>
            </footer>
        </div>
    );
};

export default Main;