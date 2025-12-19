// src/components/home/HeroBanner.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const HeroBanner = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        const value = searchTerm.trim();
        if (!value) return;
        navigate(`/all-contests?search=${encodeURIComponent(value)}`);
    };

    return (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/15 via-secondary/10 to-accent/15 border border-base-300 px-6 py-10 md:px-12 lg:py-16">
            {/* Background circles */}
            <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-secondary/10 blur-3xl" />

            <div className="relative grid gap-10 md:grid-cols-2 items-center">
                {/* Left content */}
                <div className="space-y-5">
                    <p className="inline-flex items-center gap-2 rounded-full bg-base-100/80 px-3 py-1 text-xs font-medium text-primary border border-primary/20">
                        Elevate your skills · Win real prizes · Build your portfolio
                    </p>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight text-base-content">
                        Join creative contests in{" "}
                        <span className="text-primary">design, writing, ideas,</span> and
                        more.
                    </h1>

                    <p className="text-sm md:text-base text-base-content/80 max-w-xl">
                        ContestHub connects creators and participants in one place. Discover
                        live challenges, submit your best work, and showcase your wins on a
                        public leaderboard.
                    </p>

                    {/* Search bar */}
                    <form
                        onSubmit={handleSearch}
                        className="mt-4 flex flex-col sm:flex-row gap-3"
                    >
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input input-bordered w-full sm:flex-1"
                            placeholder="Search by contest type (e.g. logo design, article writing)"
                        />
                        <button
                            type="submit"
                            className="btn btn-primary w-full sm:w-auto whitespace-nowrap"
                        >
                            Search Contests
                        </button>
                    </form>

                    {/* Quick stats */}
                    <div className="mt-6 grid grid-cols-3 gap-3 max-w-xs text-xs text-base-content/80">
                        <div>
                            <p className="font-bold text-base-content">120+</p>
                            <p>Active contests</p>
                        </div>
                        <div>
                            <p className="font-bold text-base-content">$18k+</p>
                            <p>Prize money awarded</p>
                        </div>
                        <div>
                            <p className="font-bold text-base-content">6.2k+</p>
                            <p>Submissions</p>
                        </div>
                    </div>
                </div>

                {/* Right visuals */}
                <div className="relative">
                    <div className="card bg-base-100/90 shadow-xl border border-base-300">
                        <div className="card-body space-y-4">
                            <h2 className="card-title text-base-content">
                                Today’s featured contests
                            </h2>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center justify-between">
                                    <span>Minimal logo redesign</span>
                                    <span className="badge badge-outline badge-primary">
                                        $150
                                    </span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span>Article: Future of remote work</span>
                                    <span className="badge badge-outline badge-secondary">
                                        $120
                                    </span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span>Indie game review showcase</span>
                                    <span className="badge badge-outline badge-accent">
                                        $90
                                    </span>
                                </li>
                            </ul>
                            <div className="card-actions justify-end">
                                <Link to="/all-contests" className="btn btn-sm btn-ghost">
                                    Explore all contests
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Floating badge */}
                    <div className="absolute -left-3 -top-3 rounded-full bg-success text-success-content px-4 py-1 text-xs font-semibold shadow-md">
                        New contests added daily
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroBanner;