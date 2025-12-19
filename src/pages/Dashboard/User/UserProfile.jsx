import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
} from "recharts";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useUserRole from "../../../hooks/useUserRole";

const UserProfile = () => {
    const { user, updateUserProfile } = useAuth() || {};
    const axiosSecure = useAxiosSecure();
    const { role, isUser } = useUserRole(); // <-- we use isUser to decide about chart

    // Fetch profile from backend (includes extra fields like bio)
    const {
        data: profile,
        isLoading: profileLoading,
        refetch: refetchProfile,
    } = useQuery({
        queryKey: ["user-profile"],
        queryFn: async () => {
            const res = await axiosSecure.get("/users/me");
            return res.data;
        },
    });

    // Fetch stats: participated & wins (only for normal users)
    const {
        data: stats = { participated: 0, wins: 0 },
        isLoading: statsLoading,
    } = useQuery({
        queryKey: ["user-stats"],
        enabled: isUser, // <-- do not call API for admin/creator
        queryFn: async () => {
            const res = await axiosSecure.get("/users/stats");
            return res.data;
        },
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            name: profile?.name || user?.displayName || "",
            photoURL: profile?.photoURL || user?.photoURL || "",
            bio: profile?.bio || "",
        },
    });

    // Reset form with loaded profile
    useEffect(() => {
        if (profile || user) {
            reset({
                name: profile?.name || user?.displayName || "",
                photoURL: profile?.photoURL || user?.photoURL || "",
                bio: profile?.bio || "",
            });
        }
    }, [profile, user, reset]);

    const onSubmit = async (data) => {
        try {
            if (updateUserProfile) {
                await updateUserProfile(data.name, data.photoURL);
            }

            await axiosSecure.patch("/users/profile", {
                name: data.name,
                photoURL: data.photoURL,
                bio: data.bio,
            });

            await refetchProfile();

            Swal.fire({
                icon: "success",
                title: "Profile updated",
                text: "Your profile information has been saved.",
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Update failed",
                text: "Unable to update your profile. Please try again.",
            });
        }
    };

    // For admin/creator we ignore statsLoading
    if (profileLoading || (isUser && statsLoading)) {
        return (
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-base-content">
                    My profile
                </h2>
                <div className="min-h-50 flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg text-primary" />
                </div>
            </section>
        );
    }

    const participated = stats.participated || 0;
    const wins = stats.wins || 0;
    const losses = Math.max(participated - wins, 0);
    const winPercent =
        participated > 0 ? Math.round((wins / participated) * 100) : 0;

    const chartData =
        participated > 0
            ? [
                { name: "Wins", value: wins },
                { name: "Other contests", value: losses },
            ]
            : [{ name: "No contests yet", value: 1 }];

    const COLORS = ["#22c55e", "#e5e7eb"];

    const displayName =
        profile?.name || user?.displayName || "ContestHub user";
    const photoURL =
        profile?.photoURL ||
        user?.photoURL ||
        "https://i.ibb.co/YfGbxwG/default-avatar.png";

    return (
        <section className="space-y-6">
            <div>
                <h2 className="text-xl md:text-2xl font-bold text-base-content">
                    My profile
                </h2>
                <p className="text-sm text-base-content/70">
                    View your profile and update your name, photo, and a short bio.
                    {isUser &&
                        " As a participant you can also see your contest win percentage."}
                </p>
            </div>

            <div
                className={`grid gap-4 ${isUser ? "lg:grid-cols-3" : "lg:grid-cols-2"
                    }`}
            >
                {/* Left: profile card */}
                <div className="rounded-2xl bg-base-100 border border-base-300 p-4 flex flex-col items-center gap-2">
                    <div className="avatar">
                        <div className="w-24 rounded-full border border-base-300">
                            <img src={photoURL} alt={displayName} />
                        </div>
                    </div>
                    <p className="font-semibold text-base-content">{displayName}</p>
                    <p className="text-xs text-base-content/70">{user?.email}</p>
                    <p className="text-[11px] text-base-content/60 capitalize">
                        Role: {role}
                    </p>
                    {profile?.bio && (
                        <p className="mt-2 text-xs text-base-content/70 text-center">
                            {profile.bio}
                        </p>
                    )}
                </div>

                {/* Middle: win percentage chart – ONLY for normal user */}
                {isUser && (
                    <div className="rounded-2xl bg-base-100 border border-base-300 p-4">
                        <h3 className="text-sm font-semibold text-base-content mb-2">
                            Win percentage
                        </h3>
                        <p className="text-xs text-base-content/70 mb-3">
                            Based on contests you have participated in and the ones you have
                            won.
                        </p>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        innerRadius={40}
                                        outerRadius={60}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    participated === 0
                                                        ? "#e5e7eb"
                                                        : COLORS[index % COLORS.length]
                                                }
                                            />
                                        ))}
                                    </Pie>
                                    <Legend
                                        verticalAlign="bottom"
                                        height={48}
                                        iconSize={8}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="rounded-xl bg-base-200 py-2">
                                <p className="font-semibold text-base-content">
                                    {participated}
                                </p>
                                <p className="text-[10px] text-base-content/60">
                                    Participated
                                </p>
                            </div>
                            <div className="rounded-xl bg-base-200 py-2">
                                <p className="font-semibold text-base-content">{wins}</p>
                                <p className="text-[10px] text-base-content/60">Wins</p>
                            </div>
                            <div className="rounded-xl bg-base-200 py-2">
                                <p className="font-semibold text-base-content">
                                    {winPercent}%
                                </p>
                                <p className="text-[10px] text-base-content/60">
                                    Win rate
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Right: profile update form */}
                <div className="rounded-2xl bg-base-100 border border-base-300 p-4">
                    <h3 className="text-sm font-semibold text-base-content mb-2">
                        Update profile
                    </h3>
                    <p className="text-xs text-base-content/70 mb-3">
                        This information appears on leaderboards and winner
                        announcements.
                    </p>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-3 text-sm"
                    >
                        {/* Name */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-sm leading-tight">
                                    <span className="block">Display name</span>
                                    <span className="block text-xs text-base-content/60">
                                        Shown on your profile and public areas.
                                    </span>
                                </span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered input-sm"
                                placeholder="Your name"
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
                                        Link to your profile picture.
                                    </span>
                                </span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered input-sm"
                                placeholder="https://your-photo-link.com/photo.jpg"
                                {...register("photoURL", {
                                    required: "Photo URL is required",
                                })}
                            />
                            {errors.photoURL && (
                                <p className="text-xs text-error mt-1">
                                    {errors.photoURL.message}
                                </p>
                            )}
                        </div>

                        {/* Extra field: bio */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-sm leading-tight">
                                    <span className="block">Short bio</span>
                                    <span className="block text-xs text-base-content/60">
                                        A sentence or two about yourself.
                                    </span>
                                </span>
                            </label>
                            <textarea
                                rows={3}
                                className="textarea textarea-bordered textarea-sm"
                                placeholder="Tell others who you are or what you enjoy working on..."
                                {...register("bio")}
                            />
                        </div>

                        <div className="pt-1 flex justify-end">
                            <button
                                type="submit"
                                className="btn btn-primary btn-sm px-5"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    "Save changes"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default UserProfile;