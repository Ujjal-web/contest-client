import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Legend,
} from "recharts";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const CreatorDashboardCharts = () => {
    const axiosSecure = useAxiosSecure();

    const { data: contests = [], isLoading } = useQuery({
        queryKey: ["creator-contests-for-charts"],
        queryFn: async () => {
            const res = await axiosSecure.get("/creator/contests");
            return res.data;
        },
        enabled: true,
        staleTime: 1000 * 60 * 2,
    });

    // Contests by status
    const contestsByStatus = useMemo(() => {
        const counts = {};
        (contests || []).forEach((c) => {
            const s = (c.status || "pending").toLowerCase();
            counts[s] = (counts[s] || 0) + 1;
        });
        return Object.keys(counts).map((k) => ({ status: k, count: counts[k] }));
    }, [contests]);

    // Participants per contest (top 8)
    const participantsPerContest = useMemo(() => {
        return (contests || [])
            .map((c) => ({ name: c.name || c.title || "Untitled", participants: c.participationCount || c.participantsCount || 0 }))
            .sort((a, b) => b.participants - a.participants)
            .slice(0, 8);
    }, [contests]);

    // Contests created by month
    const contestsByMonth = useMemo(() => {
        const counts = {};
        (contests || []).forEach((c) => {
            const date = c.createdAt ? new Date(c.createdAt) : null;
            if (!date) return;
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            counts[key] = (counts[key] || 0) + 1;
        });
        return Object.keys(counts).sort().map((k) => ({ month: k, count: counts[k] }));
    }, [contests]);

    const COLORS = ["#3b82f6", "#06b6d4", "#f97316", "#f43f5e", "#10b981"];

    if (isLoading) {
        return (
            <div className="rounded-2xl bg-base-100 border border-base-300 p-4">
                <h3 className="text-sm font-semibold text-base-content mb-2">Creator analytics</h3>
                <div className="min-h-40 flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg text-primary" />
                </div>
            </div>
        );
    }

    return (
        <section className="space-y-4">
            <h3 className="text-sm font-semibold text-base-content">Creator analytics</h3>
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-base-100 border border-base-300 p-4">
                    <h4 className="text-xs font-medium text-base-content mb-2">Contests by status</h4>
                    <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={contestsByStatus} dataKey="count" nameKey="status" outerRadius={60} innerRadius={28}>
                                    {contestsByStatus.map((entry, idx) => (
                                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-2xl bg-base-100 border border-base-300 p-4">
                    <h4 className="text-xs font-medium text-base-content mb-2">Top contests by participants</h4>
                    <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={participantsPerContest}>
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="participants" fill={COLORS[0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-2xl bg-base-100 border border-base-300 p-4">
                    <h4 className="text-xs font-medium text-base-content mb-2">Contests created (by month)</h4>
                    <div className="h-44">
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

export default CreatorDashboardCharts;
