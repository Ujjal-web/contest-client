const MyWinningContest = () => {
    return (
        <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-base-content">
                My winning contests
            </h2>
            <p className="text-sm text-base-content/70">
                Here you will see contests where you were declared the winner, along
                with prize amounts and contest details.
            </p>

            <div className="rounded-2xl bg-base-100 border border-base-300 p-4 text-sm text-base-content/70">
                List of Winning contests with prize summaries.
            </div>
        </section>
    );
};

export default MyWinningContest;