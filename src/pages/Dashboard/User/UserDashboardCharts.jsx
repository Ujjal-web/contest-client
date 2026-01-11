import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    BarChart,
    Bar,
} from "recharts";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const UserDashboardCharts = () => {
    const axiosSecure = useAxiosSecure();

    const { data: stats = {}, isLoading: statsLoading } = useQuery({
        queryKey: ["user-stats-charts"],
        queryFn: async () => {
            const res = await axiosSecure.get("/users/stats");
            return res.data;
        },
        enabled: true,
        staleTime: 1000 * 60 * 2,
    });

    const { data: participations = [], isLoading: partsLoading } = useQuery({
        queryKey: ["my-participations-charts"],
        queryFn: async () => {
            const res = await axiosSecure.get("/payments/my");
            return res.data;
        },
        enabled: true,
        staleTime: 1000 * 60 * 2,
    });

    const loading = statsLoading || partsLoading;

    // participation over time (by month)
    const participationByMonth = useMemo(() => {
        const counts = {};
        (participations || []).forEach((p) => {
            const date = p.paidAt ? new Date(p.paidAt) : null;
            if (!date) return;
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            counts[key] = (counts[key] || 0) + 1;
        });
        return Object.keys(counts).sort().map((k) => ({ month: k, count: counts[k] }));
    }, [participations]);

    // payments breakdown by status
    const paymentStatusBreakdown = useMemo(() => {
        const counts = {};
        (participations || []).forEach((p) => {
            const s = (p.paymentStatus || "paid").toLowerCase();
            counts[s] = (counts[s] || 0) + 1;
        });
        const arr = Object.keys(counts).map((k) => ({ name: k, value: counts[k] }));
        if (arr.length === 0) return [{ name: "No payments", value: 1 }];
        return arr;
    }, [participations]);

    // total participated and wins from stats
    const participated = stats.participated || 0;
    const wins = stats.wins || 0;
    const losses = Math.max(participated - wins, 0);
    const winPie = participated > 0 ? [{ name: "Wins", value: wins }, { name: "Other", value: losses }] : [{ name: "No contests", value: 1 }];

    const COLORS = ["#10b981", "#e5e7eb", "#3b82f6", "#f97316"];

    if (loading) {
        return (
            <div className="rounded-2xl bg-base-100 border border-base-300 p-4">
                <h3 className="text-sm font-semibold text-base-content mb-2">Your analytics</h3>
                <div className="min-h-40 flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg text-primary" />
                </div>
            </div>
        );
    }

    return (
        <section className="space-y-4">
            <h3 className="text-sm font-semibold text-base-content">Your analytics</h3>
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-base-100 border border-base-300 p-4">
                    <h4 className="text-xs font-medium text-base-content mb-2">Participation over time</h4>
                    <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={participationByMonth}>
                                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke={COLORS[2]} strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-2xl bg-base-100 border border-base-300 p-4">
                    <h4 className="text-xs font-medium text-base-content mb-2">Payment status</h4>
                    <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={paymentStatusBreakdown} dataKey="value" nameKey="name" outerRadius={60} innerRadius={28}>
                                    {paymentStatusBreakdown.map((entry, idx) => (
                                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-2xl bg-base-100 border border-base-300 p-4">
                    <h4 className="text-xs font-medium text-base-content mb-2">Win ratio</h4>
                    <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={winPie} dataKey="value" nameKey="name" outerRadius={60} innerRadius={28}>
                                    {winPie.map((entry, idx) => (
                                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UserDashboardCharts;
