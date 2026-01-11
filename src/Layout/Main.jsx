import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
            <Footer />
        </div>
    );
};

export default Main;