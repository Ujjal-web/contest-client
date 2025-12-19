import { Link } from "react-router-dom";

const ErrorPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-5xl font-bold">404</h1>
            <p className="text-xl mt-4">Page Not Found</p>
            <Link to="/" className="btn btn-primary mt-6">Go Home</Link>
        </div>
    );
};
export default ErrorPage;