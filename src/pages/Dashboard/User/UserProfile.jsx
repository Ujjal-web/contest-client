import useAuth from "../../../hooks/useAuth";

const UserProfile = () => {
    const { user } = useAuth() || {};

    return (
        <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-base-content">
                My profile
            </h2>
            <p className="text-sm text-base-content/70">
                This page will show your profile, win percentage chart, and a form to
                update your name, photo, and one extra field like bio or address.
            </p>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-base-100 border border-base-300 p-4 flex flex-col items-center gap-2">
                    <div className="avatar">
                        <div className="w-20 rounded-full border border-base-300">
                            <img
                                src={
                                    user?.photoURL ||
                                    "https://i.ibb.co/YfGbxwG/default-avatar.png"
                                }
                                alt={user?.displayName || "User"}
                            />
                        </div>
                    </div>
                    <p className="font-semibold text-base-content">
                        {user?.displayName || "User"}
                    </p>
                    <p className="text-xs text-base-content/70">{user?.email}</p>
                </div>

                <div className="rounded-2xl bg-base-100 border border-base-300 p-4 md:col-span-2">
                    <p className="text-sm text-base-content/70">
                        Coming soon: win percentage chart and profile update form.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default UserProfile;