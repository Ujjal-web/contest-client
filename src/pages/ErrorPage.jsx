import { Link } from "react-router-dom";

const ErrorPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
            <div className="text-center space-y-4">
                <p className="text-xs uppercase tracking-[0.2em] text-base-content/60">
                    ContestHub
                </p>
                <h1 className="text-6xl md:text-7xl font-black text-base-content">
                    404
                </h1>
                <p className="text-lg md:text-xl text-base-content/80">
                    The page you’re looking for could not be found.
                </p>
                <p className="text-xs md:text-sm text-base-content/60 max-w-md mx-auto">
                    It might have been moved, deleted, or you may have typed the address
                    incorrectly.
                </p>
                <Link to="/" className="btn btn-primary mt-2">
                    ← Back to home
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;