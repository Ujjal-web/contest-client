import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const Register = () => {
    const { createUser, updateUserProfile, googleSignIn } = useAuth() || {};
    const axios = useAxiosPublic();
    const navigate = useNavigate();
    const location = useLocation();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    const passwordValue = watch("password");

    const onSubmit = async (data) => {
        try {
            const { name, photoURL, email, password, rolePreference } = data;
            const created = await createUser(email, password);
            if (created) {
                await updateUserProfile({ displayName: name, photoURL });
                const payload = { name, email, photoURL, role: rolePreference || "user" };
                await axios.post("/users", payload);
                Swal.fire("Success", "Account created successfully", "success");
                reset();
                const dest = location?.state?.from?.pathname || "/";
                navigate(dest, { replace: true });
            }
        } catch (err) {
            Swal.fire("Error", err?.message || "Registration failed", "error");
        }
    };

    const handleGoogleRegister = async () => {
        try {
            const res = await googleSignIn();
            const user = res?.user;
            if (user?.email) {
                const payload = { name: user.displayName, email: user.email, photoURL: user.photoURL, role: "user" };
                await axios.post("/users", payload);
                Swal.fire("Success", "Signed in with Google", "success");
                const dest = location?.state?.from?.pathname || "/";
                navigate(dest, { replace: true });
            }
        } catch (err) {
            Swal.fire("Error", err?.message || "Google sign-in failed", "error");
        }
    };
    return (
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4">
            <div className="w-full max-w-5xl grid gap-8 md:grid-cols-2 items-start">
                {/* Left: info panel (desktop) */}
                <div className="hidden md:flex flex-col justify-center gap-6 p-8 rounded-3xl bg-gradient-to-br from-primary/8 to-accent/6 border border-base-200">
                    <h1 className="text-4xl font-extrabold text-base-content">Create your ContestHub account</h1>
                    <p className="text-base text-base-content/70 max-w-lg">Start as a participant and request creator access when ready. Join contests, submit work, and win prizes.</p>
                    <div className="space-y-2">
                        <RoleInfo title="Participant (Normal user)" description="Join contests after payment, submit tasks, and track your participated and winning contests." />
                        <RoleInfo title="Contest creator" description="Propose and host contests. Once an admin approves your creator role, you can manage contests and declare winners." />
                    </div>
                </div>

                {/* Right: register card */}
                <div className="mx-auto w-full max-w-md">
                    <div className="rounded-3xl p-8 shadow-2xl border border-base-300 bg-base-100/80 backdrop-blur-sm">
                        <div className="mb-4 text-center">
                            <h2 className="text-2xl font-bold text-base-content">Create account</h2>
                            <p className="text-sm text-base-content/70">Join ContestHub to start participating</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="text-xs text-base-content/70">Full name</label>
                                <input type="text" placeholder="Enter your full name" className="input input-lg input-bordered w-full mt-2" {...register("name", { required: "Name is required" })} />
                                {errors.name && <p className="text-xs text-error mt-1">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label className="text-xs text-base-content/70">Photo URL</label>
                                <input type="text" placeholder="https://your-photo-link.com/image.jpg" className="input input-lg input-bordered w-full mt-2" {...register("photoURL", { required: "Photo URL is required", pattern: { value: /^(ftp|http|https):\/\/[^ \" ]+$/, message: "Invalid URL format" } })} />
                                {errors.photoURL && <p className="text-xs text-error mt-1">{errors.photoURL.message}</p>}
                            </div>

                            <div>
                                <label className="text-xs text-base-content/70">Email address</label>
                                <input type="email" placeholder="you@example.com" className="input input-lg input-bordered w-full mt-2" {...register("email", { required: "Email is required", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: "Invalid email address" } })} />
                                {errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="text-xs text-base-content/70">Password</label>
                                <input type="password" placeholder="Create a strong password" className="input input-lg input-bordered w-full mt-2" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" }, validate: { hasUppercase: (value) => /[A-Z]/.test(value) || "Password must contain at least one uppercase letter", hasNumber: (value) => /\d/.test(value) || "Password must contain at least one number", hasSpecialChar: (value) => /[!@#$%^&*(),.?\":{}|<>]/.test(value) || "Password must contain at least one special character", }, })} />
                                {errors.password && <p className="text-xs text-error mt-1">{errors.password.message}</p>}
                            </div>

                            <div>
                                <label className="text-xs text-base-content/70">Confirm password</label>
                                <input type="password" placeholder="Re-enter your password" className="input input-lg input-bordered w-full mt-2" {...register("confirmPassword", { required: "Please confirm your password", validate: (value) => value === passwordValue || "Passwords do not match" })} />
                                {errors.confirmPassword && <p className="text-xs text-error mt-1">{errors.confirmPassword.message}</p>}
                            </div>

                            <div>
                                <label className="text-xs text-base-content/70">How do you plan to use ContestHub?</label>
                                <div className="grid gap-2 mt-2">
                                    <label className="flex items-start gap-2 cursor-pointer">
                                        <input type="radio" value="user" className="radio radio-primary mt-1" {...register("rolePreference")} defaultChecked />
                                        <div>
                                            <p className="text-sm text-base-content/80 font-medium">Join contests as a participant</p>
                                            <p className="text-xs text-base-content/60">Pay entry fees, submit tasks, and grow your win history.</p>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-2 cursor-pointer">
                                        <input type="radio" value="creator" className="radio radio-secondary mt-1" {...register("rolePreference")} />
                                        <div>
                                            <p className="text-sm text-base-content/80 font-medium">Host contests as a creator</p>
                                            <p className="text-xs text-base-content/60">Propose contests and, once approved by an admin, manage submissions and winners.</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary btn-block rounded-lg h-12" disabled={isSubmitting}>{isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : "Create account"}</button>
                        </form>

                        <div className="divider my-4">or sign up with</div>

                        <button type="button" onClick={handleGoogleRegister} className="btn btn-outline w-full flex items-center justify-center gap-3 rounded-lg h-12">
                            <GoogleIcon />
                            <span>Continue with Google</span>
                        </button>

                        <p className="text-center text-sm text-base-content/70 mt-4">Already have an account? <Link to="/login" className="link link-primary">Log in</Link></p>
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