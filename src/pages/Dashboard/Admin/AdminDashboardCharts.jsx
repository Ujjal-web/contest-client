import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    LineChart,
    Line,
} from "recharts";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AdminDashboardCharts = () => {
    const axiosSecure = useAxiosSecure();

    const { data: users = [], isLoading: usersLoading } = useQuery({
        queryKey: ["admin-users"],
        queryFn: async () => {
            const res = await axiosSecure.get("/users");
            return res.data;
        },
        staleTime: 1000 * 60 * 2,
    });

    const { data: contestsData = { contests: [] }, isLoading: contestsLoading } = useQuery({
        queryKey: ["admin-contests-all"],
        queryFn: async () => {
            // Request a large limit so we can compute summaries client-side
            const res = await axiosSecure.get(`/admin/contests?limit=1000&page=1`);
            return res.data;
        },
        staleTime: 1000 * 60 * 2,
    });

    const contests = contestsData.contests || [];

    // Users by role (pie)
    const usersByRole = useMemo(() => {
        const counts = {};
        (users || []).forEach((u) => {
            const r = (u.role || "user").toLowerCase();
            counts[r] = (counts[r] || 0) + 1;
        });
        return Object.keys(counts).map((k) => ({ name: k, value: counts[k] }));
    }, [users]);

    // Contests by status (bar)
    const contestsByStatus = useMemo(() => {
        const counts = {};
        (contests || []).forEach((c) => {
            const s = (c.status || "unknown").toLowerCase();
            counts[s] = (counts[s] || 0) + 1;
        });
        return Object.keys(counts).map((k) => ({ status: k, count: counts[k] }));
    }, [contests]);

    // Contests created over time (line) - group by month
    const contestsByMonth = useMemo(() => {
        const counts = {};
        (contests || []).forEach((c) => {
            const date = c.createdAt ? new Date(c.createdAt) : null;
            if (!date) return;
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            counts[key] = (counts[key] || 0) + 1;
        });
        const entries = Object.keys(counts)
            .sort()
            .map((k) => ({ month: k, count: counts[k] }));
        return entries;
    }, [contests]);

    const COLORS = ["#3b82f6", "#06b6d4", "#f97316", "#f43f5e", "#10b981"];

    if (usersLoading || contestsLoading) {
        return (
            <div className="rounded-2xl bg-base-100 border border-base-300 p-4">
                <h3 className="text-sm font-semibold text-base-content mb-2">Platform analytics</h3>
                <div className="min-h-40 flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg text-primary" />
                </div>
            </div>
        );
    }

    return (
        <section className="space-y-4">
            <h3 className="text-sm font-semibold text-base-content">Platform analytics</h3>

            <div className="grid gap-4 md:grid-cols-3">
                {/* Users by role */}
                <div className="rounded-2xl bg-base-100 border border-base-300 p-4">
                    <h4 className="text-xs font-medium text-base-content mb-2">Users by role</h4>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={usersByRole} dataKey="value" nameKey="name" outerRadius={60} innerRadius={28}>
                                    {usersByRole.map((entry, idx) => (
                                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Contests by status */}
                <div className="rounded-2xl bg-base-100 border border-base-300 p-4">
                    <h4 className="text-xs font-medium text-base-content mb-2">Contests by status</h4>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={contestsByStatus}>
                                <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="count" fill={COLORS[0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Contests over time */}
                <div className="rounded-2xl bg-base-100 border border-base-300 p-4">
                    <h4 className="text-xs font-medium text-base-content mb-2">Contests created (by month)</h4>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={contestsByMonth}>
                                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke={COLORS[1]} strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminDashboardCharts;
