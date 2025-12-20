const WhyContestHubSection = () => {
    const items = [
        {
            title: "Create contests in minutes",
            description:
                "Set entry fees, prize money, deadlines, and clear instructions. Our dashboard helps you manage everything from one place.",
        },
        {
            title: "Join from anywhere",
            description:
                "Browse approved contests, pay the entry fee securely, and submit your work before the deadline—no matter where you are.",
        },
        {
            title: "Celebrate your progress",
            description:
                "Your wins appear on your profile and the global leaderboard so you can show your achievements to clients, employers, or friends.",
        },
    ];

    return (
        <section className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold text-base-content">
                    Why creators and participants choose ContestHub
                </h2>
                <p className="text-sm text-base-content/70 max-w-2xl mx-auto">
                    ContestHub is designed for flexibility. Design challenges, writing
                    prompts, startup pitches, and game reviews all live comfortably in the
                    same platform.
                </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
                {items.map((item) => (
                    <div
                        key={item.title}
                        className="rounded-2xl bg-base-100 border border-base-300 p-5 space-y-2"
                    >
                        <h3 className="font-semibold text-base-content">{item.title}</h3>
                        <p className="text-xs md:text-sm text-base-content/70">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WhyContestHubSection;