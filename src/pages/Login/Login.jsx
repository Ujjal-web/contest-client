import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const Login = () => {
    const { signIn, googleSignIn } = useAuth() || {};
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm();

    const onSubmit = async (data) => {
        if (!signIn) return;

        try {
            const result = await signIn(data.email, data.password);
            const loggedUser = result.user;

            // JWT is issued in AuthProvider's onAuthStateChanged
            Swal.fire({
                icon: "success",
                title: "Welcome back",
                text: `Logged in as ${loggedUser.email}`,
                timer: 1800,
                showConfirmButton: false,
            });

            reset();
            navigate(from, { replace: true });
        } catch (error) {
            console.error(error);

            let message = "Something went wrong. Please try again.";

            if (
                error?.code === "auth/invalid-credential" ||
                error?.code === "auth/wrong-password"
            ) {
                message = "Email or password is incorrect.";
            } else if (error?.code === "auth/user-not-found") {
                message = "No account found with this email.";
            }

            Swal.fire({
                icon: "error",
                title: "Login failed",
                text: message,
            });
        }
    };

    const handleGoogleLogin = async () => {
        if (!googleSignIn) return;

        try {
            const result = await googleSignIn();
            const loggedUser = result.user;

            Swal.fire({
                icon: "success",
                title: "Logged in with Google",
                text: `Welcome, ${loggedUser.displayName || loggedUser.email}`,
                timer: 1800,
                showConfirmButton: false,
            });

            navigate(from, { replace: true });
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Google login failed",
                text: "Unable to authenticate with Google right now.",
            });
        }
    };

    return (
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4">
            <div className="w-full max-w-5xl bg-transparent grid gap-8 md:grid-cols-2 items-center">
                {/* Left: illustration / pitch */}
                <div className="hidden md:flex flex-col justify-center gap-6 p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/6 border border-base-200">
                    <h1 className="text-4xl font-extrabold text-base-content">Welcome to ContestHub</h1>
                    <p className="text-base text-base-content/70 max-w-lg">
                        Role-based dashboards for Admins, Contest Creators, and Participants —
                        manage contests, submit designs and win prizes. Secure, modern, and community-driven.
                    </p>

                    <div className="grid gap-3">
                        <div className="flex items-start gap-3">
                            <span className="badge badge-error">Admin</span>
                            <div>
                                <p className="text-sm font-semibold text-base-content">Platform management</p>
                                <p className="text-xs text-base-content/70">Approve contests and manage users.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="badge badge-primary">Creator</span>
                            <div>
                                <p className="text-sm font-semibold text-base-content">Host contests</p>
                                <p className="text-xs text-base-content/70">Create contests and review submissions.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="badge badge-success">Participant</span>
                            <div>
                                <p className="text-sm font-semibold text-base-content">Join & win</p>
                                <p className="text-xs text-base-content/70">Pay entry fees, submit your work, and track wins.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: modern login card */}
                <div className="mx-auto w-full max-w-md">
                    <div className="rounded-3xl p-8 shadow-2xl border border-base-300 bg-base-100/80 backdrop-blur-sm">
                        <div className="mb-4 text-center">
                            <h2 className="text-2xl font-bold text-base-content">Welcome back</h2>
                            <p className="text-sm text-base-content/70">Sign in to continue to your dashboard</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="text-xs text-base-content/70">Email address</label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="input input-lg input-bordered w-full mt-2"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                            message: "Invalid email address",
                                        },
                                    })}
                                />
                                {errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="text-xs text-base-content/70">Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="input input-lg input-bordered w-full mt-2"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: { value: 6, message: "Password must be at least 6 characters" },
                                    })}
                                />
                                {errors.password && <p className="text-xs text-error mt-1">{errors.password.message}</p>}
                            </div>

                            <button type="submit" className="btn btn-primary btn-block rounded-lg h-12" disabled={isSubmitting}>
                                {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : "Sign in"}
                            </button>
                        </form>

                        <div className="divider my-4">or continue with</div>

                        <button type="button" onClick={handleGoogleLogin} className="btn btn-outline w-full flex items-center justify-center gap-3 rounded-lg h-12">
                            <GoogleIcon />
                            <span>Continue with Google</span>
                        </button>

                        <p className="text-center text-sm text-base-content/70 mt-4">
                            New to ContestHub? <Link to="/register" className="link link-primary">Create an account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RoleCard = ({ title, description, accent }) => (
    <div className="rounded-2xl bg-base-100 border border-base-300 p-3">
        <div className="flex items-center gap-2 mb-1">
            <span className={`badge badge-sm ${accent}`}>{title}</span>
            <span className="text-xs text-base-content/60 capitalize">
                {title === "Admin"
                    ? "platform manager"
                    : title === "Contest Creator"
                        ? "host contests"
                        : "join contests"}
            </span>
        </div>
        <p className="text-xs text-base-content/80">{description}</p>
    </div>
);

const GoogleIcon = () => (
    <svg
        className="w-5 h-5"
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fill="#FFC107"
            d="M43.6 20.5H42V20H24v8h11.3A11.9 11.9 0 0 1 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.7 3l5.7-5.7C33.9 6.2 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.1-.4-3.5z"
        />
        <path
            fill="#FF3D00"
            d="M6.3 14.7 12 19c1.6-3.9 5.4-7 12-7 3 0 5.7 1.1 7.7 3l5.7-5.7C33.9 6.2 29.2 4 24 4 15.3 4 8.2 9 6.3 14.7z"
        />
        <path
            fill="#4CAF50"
            d="M24 44c5.1 0 9.8-1.9 13.4-5.1L32.2 34C30.3 35.5 27.5 36 24 36c-4.6 0-8.4-2.6-10.3-6.4l-5.6 4.3C10 39.2 16.5 44 24 44z"
        />
        <path
            fill="#1976D2"
            d="M43.6 20.5H42V20H24v8h11.3c-1 2.7-2.8 4.7-5.1 6.2l5.7 4.9C38 36.7 40 33 41.2 29.1c.7-2.2 1.1-4.6 1.1-7.1 0-1.2-.1-2.1-.4-3.5z"
        />
    </svg>
);

export default Login;