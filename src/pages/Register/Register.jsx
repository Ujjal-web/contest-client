import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const Register = () => {
    const { createUser, updateUserProfile, googleSignIn } = useAuth() || {};
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
    } = useForm({
        defaultValues: {
            rolePreference: "user",
        },
    });

    const passwordValue = watch("password");

    const saveUserToDb = async (userObj) => {
        try {
            await axiosPublic.post("/users", userObj);
        } catch (error) {
            console.error("Failed to save user:", error);
        }
    };

    const onSubmit = async (data) => {
        if (!createUser || !updateUserProfile) return;

        try {
            // 1. Create Firebase account
            const result = await createUser(data.email, data.password);
            const createdUser = result.user;

            // 2. Update Firebase profile
            await updateUserProfile(data.name, data.photoURL);

            // 3. Save user to backend database
            const userInfo = {
                name: data.name,
                email: data.email,
                photoURL: data.photoURL,
                role: "user", // real role; admin can change later
                rolePreference: data.rolePreference, // how they want to use the platform
            };

            await saveUserToDb(userInfo);

            Swal.fire({
                icon: "success",
                title: "Account created",
                text:
                    data.rolePreference === "creator"
                        ? "Your account is ready. An admin can upgrade you to Contest Creator."
                        : "Your account is ready. Start joining contests right away.",
                timer: 2200,
                showConfirmButton: false,
            });

            reset();
            navigate(from, { replace: true });
        } catch (error) {
            console.error(error);

            let message = "Unable to create account. Please try again.";

            if (error?.code === "auth/email-already-in-use") {
                message = "This email is already registered. Try logging in instead.";
            }

            Swal.fire({
                icon: "error",
                title: "Registration failed",
                text: message,
            });
        }
    };

    const handleGoogleRegister = async () => {
        if (!googleSignIn) return;

        try {
            const result = await googleSignIn();
            const loggedUser = result.user;

            const userInfo = {
                name: loggedUser.displayName,
                email: loggedUser.email,
                photoURL: loggedUser.photoURL,
                role: "user",
                rolePreference: "user",
            };

            await saveUserToDb(userInfo);

            Swal.fire({
                icon: "success",
                title: "Signed up with Google",
                text: "Your account is ready. You can start joining contests.",
                timer: 2200,
                showConfirmButton: false,
            });

            navigate(from, { replace: true });
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Google signup failed",
                text: "Unable to sign up with Google right now.",
            });
        }
    };

    return (
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
            <div className="grid w-full max-w-5xl gap-8 md:grid-cols-2 items-start">
                {/* Left: roles overview */}
                <div className="hidden md:flex flex-col gap-4 mt-4">
                    <h1 className="text-3xl lg:text-4xl font-black text-base-content">
                        Create your ContestHub account
                    </h1>
                    <p className="text-sm text-base-content/70">
                        Every new account starts as a participant. If you select “Contest
                        creator” below, admins can review your profile and upgrade your
                        role.
                    </p>

                    <div className="space-y-3 text-sm">
                        <RoleInfo
                            title="Participant (Normal user)"
                            description="Join contests after payment, submit tasks, and track your participated and winning contests."
                        />
                        <RoleInfo
                            title="Contest creator"
                            description="Propose and host contests. Once an admin approves your creator role, you can add, edit, and manage contests."
                        />
                        <RoleInfo
                            title="Admin"
                            description="Reserved for platform administrators. Admins approve contests and change user roles."
                        />
                    </div>
                </div>

                {/* Right: register card */}
                <div className="w-full max-w-md mx-auto mb-6">
                    <div className="card bg-base-100 shadow-xl border border-base-300">
                        <div className="card-body space-y-4">
                            <h2 className="text-2xl font-bold text-center text-base-content">
                                Sign up to get started
                            </h2>
                            <p className="text-center text-xs text-base-content/70">
                                You can join contests immediately. Creator and admin roles are
                                managed by the platform team.
                            </p>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                                {/* Name */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-sm leading-tight">
                                            <span className="block">Full name</span>
                                            <span className="block text-xs text-base-content/60">
                                                This name will appear on leaderboards and winner
                                                announcements.
                                            </span>
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your full name"
                                        className="input input-bordered"
                                        {...register("name", {
                                            required: "Name is required",
                                        })}
                                    />
                                    {errors.name && (
                                        <p className="text-xs text-error mt-1">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                {/* Photo URL */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-sm leading-tight">
                                            <span className="block">Photo URL</span>
                                            <span className="block text-xs text-base-content/60">
                                                Link to your profile picture. It helps others recognize
                                                you in contests and dashboards.
                                            </span>
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="https://your-photo-link.com/image.jpg"
                                        className="input input-bordered"
                                        {...register("photoURL", {
                                            required: "Photo URL is required",
                                            pattern: {
                                                value: /^(ftp|http|https):\/\/[^ "]+$/,
                                                message: "Invalid URL format",
                                            },
                                        })}
                                    />
                                    {errors.photoURL && (
                                        <p className="text-xs text-error mt-1">
                                            {errors.photoURL.message}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-sm leading-tight">
                                            <span className="block">Email address</span>
                                            <span className="block text-xs text-base-content/60">
                                                We use your email for login and important contest
                                                updates.
                                            </span>
                                        </span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        className="input input-bordered"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                                message: "Invalid email address",
                                            },
                                        })}
                                    />
                                    {errors.email && (
                                        <p className="text-xs text-error mt-1">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-sm leading-tight">
                                            <span className="block">Password</span>
                                            <span className="block text-xs text-base-content/60">
                                                Use at least 6 characters with one uppercase letter and
                                                one number.
                                            </span>
                                        </span>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Create a strong password"
                                        className="input input-bordered"
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 6,
                                                message: "Password must be at least 6 characters",
                                            },
                                            validate: {
                                                hasUppercase: (value) =>
                                                    /[A-Z]/.test(value) ||
                                                    "Password must contain at least one uppercase letter",
                                                hasNumber: (value) =>
                                                    /\d/.test(value) ||
                                                    "Password must contain at least one number",
                                                hasSpecialChar: (value) =>
                                                    /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                                                    "Password must contain at least one special character",
                                            },
                                        })}
                                    />
                                    {errors.password && (
                                        <p className="text-xs text-error mt-1">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm password */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-sm leading-tight">
                                            <span className="block">Confirm password</span>
                                            <span className="block text-xs text-base-content/60">
                                                Re-enter your password to avoid typos.
                                            </span>
                                        </span>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Re-enter your password"
                                        className="input input-bordered"
                                        {...register("confirmPassword", {
                                            required: "Please confirm your password",
                                            validate: (value) =>
                                                value === passwordValue ||
                                                "Passwords do not match",
                                        })}
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-xs text-error mt-1">
                                            {errors.confirmPassword.message}
                                        </p>
                                    )}
                                </div>

                                {/* Role preference */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-sm leading-tight">
                                            <span className="block">How do you plan to use ContestHub?</span>
                                            <span className="block text-xs text-base-content/60">
                                                Your account starts as a participant. Admins can review
                                                your preference and promote you to creator.
                                            </span>
                                        </span>
                                    </label>
                                    <div className="grid gap-2">
                                        <label className="flex items-start gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="user"
                                                className="radio radio-primary mt-1"
                                                {...register("rolePreference")}
                                                defaultChecked
                                            />
                                            <span className="text-xs text-base-content/80">
                                                <span className="block font-medium">
                                                    Join contests as a participant
                                                </span>
                                                <span className="block text-base-content/60">
                                                    Pay entry fees, submit tasks, and grow your win
                                                    history.
                                                </span>
                                            </span>
                                        </label>

                                        <label className="flex items-start gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="creator"
                                                className="radio radio-secondary mt-1"
                                                {...register("rolePreference")}
                                            />
                                            <span className="text-xs text-base-content/80">
                                                <span className="block font-medium">
                                                    Host contests as a creator
                                                </span>
                                                <span className="block text-base-content/60">
                                                    Propose contests and, once approved by an admin, add
                                                    new contests, edit details, and declare winners.
                                                </span>
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-full mt-2"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="loading loading-spinner loading-sm"></span>
                                    ) : (
                                        "Create account"
                                    )}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="divider text-xs mt-1 mb-1">or sign up with</div>

                            {/* Google signup */}
                            <button
                                type="button"
                                onClick={handleGoogleRegister}
                                className="btn btn-outline w-full flex items-center gap-2"
                            >
                                <GoogleIcon />
                                <span>Sign up with Google</span>
                            </button>

                            {/* Login link */}
                            <p className="text-center text-xs md:text-sm text-base-content/70 pt-2">
                                Already have an account?{" "}
                                <Link to="/login" className="link link-primary">
                                    Log in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RoleInfo = ({ title, description }) => (
    <div className="rounded-2xl bg-base-100 border border-base-300 p-3">
        <p className="text-sm font-semibold text-base-content mb-1">{title}</p>
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

export default Register;