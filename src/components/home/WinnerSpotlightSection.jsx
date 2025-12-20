const WinnerSpotlightSection = () => {
    const winners = [
        {
            name: "Olivia Carter",
            contest: "Brand refresh logo challenge",
            prize: "$350",
        },
        {
            name: "Muhammad Rahman",
            contest: "Short story: Turning points",
            prize: "$220",
        },
        {
            name: "Emily Zhang",
            contest: "Indie game review showcase",
            prize: "$180",
        },
    ];

    return (
        <section className="rounded-3xl bg-base-100 border border-base-300 px-6 py-8 md:px-10 md:py-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-base-content">
                        Winners who turned ideas into rewards
                    </h2>
                    <p className="text-sm text-base-content/70 max-w-xl">
                        Every contest you join is a chance to improve your skills and build
                        a public record of achievements. Your next win could be featured
                        here.
                    </p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center text-xs md:text-sm">
                    <div className="rounded-2xl bg-base-200 px-4 py-3">
                        <p className="text-lg md:text-xl font-bold text-primary">210+</p>
                        <p className="text-base-content/70">Total winners</p>
                    </div>
                    <div className="rounded-2xl bg-base-200 px-4 py-3">
                        <p className="text-lg md:text-xl font-bold text-secondary">
                            $18,400+
                        </p>
                        <p className="text-base-content/70">Prize money awarded</p>
                    </div>
                    <div className="rounded-2xl bg-base-200 px-4 py-3">
                        <p className="text-lg md:text-xl font-bold text-accent">96%</p>
                        <p className="text-base-content/70">Creators repeat contests</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {winners.map((winner, idx) => (
                    <div
                        key={idx}
                        className="rounded-2xl border border-base-300 bg-base-100 p-4 space-y-2 shadow-sm"
                    >
                        <p className="font-semibold text-base-content">{winner.name}</p>
                        <p className="text-xs text-base-content/70">
                            Winner of{" "}
                            <span className="font-medium text-base-content">
                                {winner.contest}
                            </span>
                        </p>
                        <p className="text-sm font-semibold text-success">
                            Prize: {winner.prize}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WinnerSpotlightSection;