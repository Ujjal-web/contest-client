import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";

const Dashboard = () => {
    const { user } = useAuth() || {};
    const { role, isAdmin, isCreator, isUser, isRoleLoading } = useUserRole();

    if (isRoleLoading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <section className="rounded-3xl bg-base-100 border border-base-300 p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <p className="text-xs uppercase tracking-wide text-base-content/60">
                        Dashboard
                    </p>
                    <h1 className="text-2xl md:text-3xl font-bold text-base-content mt-1">
                        Hello, {user?.displayName || "Participant"}
                    </h1>
                    <p className="text-sm text-base-content/70 mt-1">
                        You are currently signed in as{" "}
                        <span className="font-semibold capitalize">{role}</span>. Your
                        dashboard options are tailored to what you can do on ContestHub.
                    </p>
                </div>
                <div className="text-sm text-base-content/80">
                    <p className="font-semibold">Quick info</p>
                    <p className="text-xs text-base-content/60">
                        Email: {user?.email || "Not available"}
                    </p>
                    <p className="text-xs text-base-content/60">
                        Role: <span className="capitalize">{role}</span>
                    </p>
                </div>
            </section>

            {/* Participant / Normal user section */}
            {isUser && <UserDashboardSection />}

            {/* Creator section */}
            {isCreator && <CreatorDashboardSection />}

            {/* Admin section */}
            {isAdmin && <AdminDashboardSection />}
        </div>
    );
};

export default Dashboard;

/* ---------- Sections for each role ---------- */

const Card = ({ title, description, href, badge }) => (
    <div className="rounded-2xl bg-base-100 border border-base-300 p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-base-content text-sm md:text-base">
                {title}
            </h3>
            {badge && (
                <span className="badge badge-outline badge-xs md:badge-sm">
                    {badge}
                </span>
            )}
        </div>
        <p className="text-xs md:text-sm text-base-content/70">{description}</p>
        {href && (
            <div className="pt-1">
                <Link to={href} className="link link-primary text-xs md:text-sm">
                    Open this section
                </Link>
            </div>
        )}
    </div>
);

/* Normal user / participant */
const UserDashboardSection = () => (
    <section className="space-y-3">
        <div>
            <h2 className="text-lg md:text-xl font-bold text-base-content">
                Participant overview
            </h2>
            <p className="text-xs md:text-sm text-base-content/70">
                As a participant you can join contests after payment, submit tasks, and
                track your progress over time.
            </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
            <Card
                title="My participated contests"
                description="View every contest you have joined, payment status, and upcoming deadlines so you never miss a submission."
                href="/dashboard/user/participated"
                badge="Normal user"
            />
            <Card
                title="My winning contests"
                description="See contests where you were declared winner along with the prize amounts and contest details."
                href="/dashboard/user/wins"
            />
            <Card
                title="My profile"
                description="Update your name, profile photo, and bio or address. Watch your win percentage grow over time."
                href="/dashboard/user/profile"
            />
        </div>
    </section>
);

/* Contest creator */
const CreatorDashboardSection = () => (
    <section className="space-y-3">
        <div>
            <h2 className="text-lg md:text-xl font-bold text-base-content">
                Creator tools
            </h2>
            <p className="text-xs md:text-sm text-base-content/70">
                As a contest creator you can propose new contests, manage submissions,
                and declare winners after deadlines.
            </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card
                title="Add new contest"
                description="Create a new contest with entry fee, prize money, clear task instructions, and a deadline."
                href="/dashboard/creator/add-contest"
                badge="Creator"
            />
            <Card
                title="My created contests"
                description="View all contests you have created, including pending, approved, and rejected ones."
                href="/dashboard/creator/my-contests"
            />
            <Card
                title="Review submissions"
                description="From each contest, open the submissions view to read entries and declare a single winner."
                href="/dashboard/creator/my-contests"
            />
        </div>
    </section>
);

/* Admin */
const AdminDashboardSection = () => (
    <section className="space-y-3">
        <div>
            <h2 className="text-lg md:text-xl font-bold text-base-content">
                Admin controls
            </h2>
            <p className="text-xs md:text-sm text-base-content/70">
                As an admin you keep ContestHub healthy. Approve or reject contests and
                adjust user roles when needed.
            </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card
                title="Manage users"
                description="View all registered users and change their roles between User, Creator, and Admin."
                href="/dashboard/admin/manage-users"
                badge="Admin"
            />
            <Card
                title="Manage contests"
                description="Review all contests on the platform. Confirm, reject, or delete contests that break the rules."
                href="/dashboard/admin/manage-contests"
            />
            <Card
                title="Platform overview"
                description="Use this dashboard alongside analytics to get a quick sense of platform activity."
            />
        </div>
    </section>
);