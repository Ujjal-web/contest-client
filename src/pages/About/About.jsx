const About = () => {
    return (
        <section className="space-y-8">
            {/* Hero */}
            <div className="rounded-3xl bg-base-100 border border-base-300 p-6 md:p-8 shadow-sm">
                <h1 className="text-2xl md:text-3xl font-bold text-base-content mb-2">
                    About ContestHub
                </h1>
                <p className="text-sm md:text-base text-base-content/70 max-w-3xl">
                    ContestHub is a modern platform where creators can host contests and
                    participants can join, submit their best work, and build a public
                    track record of achievements. Our goal is to make creative
                    competitions transparent, fair, and easy to manage for everyone.
                </p>
            </div>

            {/* Three columns: who it's for */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-base-100 border border-base-300 p-4 space-y-2">
                    <h2 className="text-sm font-semibold text-base-content">
                        For participants
                    </h2>
                    <p className="text-xs text-base-content/70">
                        Join design, writing, and idea contests from one dashboard. Pay the
                        entry fee securely, submit your work before the deadline, and see
                        your winnings on the leaderboard and profile.
                    </p>
                </div>

                <div className="rounded-2xl bg-base-100 border border-base-300 p-4 space-y-2">
                    <h2 className="text-sm font-semibold text-base-content">
                        For contest creators
                    </h2>
                    <p className="text-xs text-base-content/70">
                        Launch contests in minutes. Define prize money, entry fees,
                        instructions, and deadlines. Review submissions in one place and
                        declare a single winner when the contest ends.
                    </p>
                </div>

                <div className="rounded-2xl bg-base-100 border border-base-300 p-4 space-y-2">
                    <h2 className="text-sm font-semibold text-base-content">
                        For admins
                    </h2>
                    <p className="text-xs text-base-content/70">
                        Keep the platform safe by reviewing contests, adjusting user roles,
                        and moderating activity. Admin tools help maintain a fair and
                        consistent experience for everyone.
                    </p>
                </div>
            </div>

            {/* How it works summary */}
            <div className="rounded-3xl bg-base-100 border border-base-300 p-6 space-y-4">
                <h2 className="text-lg md:text-xl font-semibold text-base-content">
                    How ContestHub works in practice
                </h2>
                <ol className="list-decimal list-inside space-y-2 text-sm text-base-content/80">
                    <li>
                        <span className="font-medium">Creators propose contests.</span>{" "}
                        They fill out a simple form with a title, description, prize money,
                        entry fee, contest type, and deadline.
                    </li>
                    <li>
                        <span className="font-medium">Admins review and approve.</span>{" "}
                        Each contest starts as pending. Admins confirm or reject contests
                        before they appear on the public All Contests page.
                    </li>
                    <li>
                        <span className="font-medium">
                            Participants register and pay securely.
                        </span>{" "}
                        Payments are processed through Stripe in test mode for this
                        project, and registration status is tracked automatically.
                    </li>
                    <li>
                        <span className="font-medium">Participants submit tasks.</span>{" "}
                        Once registered, participants can upload links or detailed
                        submissions directly from the contest details page.
                    </li>
                    <li>
                        <span className="font-medium">Creators review and declare a winner.</span>{" "}
                        After the deadline, creators read submissions, choose one winner,
                        and the winner information shows across the site.
                    </li>
                    <li>
                        <span className="font-medium">
                            Leaderboard and profile highlight achievements.
                        </span>{" "}
                        Winning contests increase a participant’s visibility, making it
                        easier to showcase real work to clients or employers.
                    </li>
                </ol>
            </div>

            {/* Tech / project info */}
            {/* <div className="rounded-3xl bg-base-100 border border-base-300 p-6 space-y-3">
                <h2 className="text-lg md:text-xl font-semibold text-base-content">
                    Built for learning and real projects
                </h2>
                <p className="text-sm text-base-content/70 max-w-3xl">
                    This version of ContestHub is designed as a full‑stack portfolio
                    project. It uses React, React Router, TanStack Query, Firebase
                    Authentication, Node.js, Express, MongoDB, Stripe (test mode), and
                    Tailwind CSS with DaisyUI. The goal is to mirror real-world features
                    like role-based dashboards, secure APIs with JWT, payment flows,
                    leaderboard logic, and responsive UI patterns.
                </p>
            </div> */}
        </section>
    );
};

export default About;