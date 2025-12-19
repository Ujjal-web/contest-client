const MyParticipatedContests = () => {
    return (
        <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-base-content">
                My participated contests
            </h2>
            <p className="text-sm text-base-content/70">
                This table will list all contests you registered for after payment. We
                will later sort them by upcoming deadline and show payment status.
            </p>

            <div className="rounded-2xl bg-base-100 border border-base-300 p-4 text-sm text-base-content/70">
                Table of your paid contests.
            </div>
        </section>
    );
};

export default MyParticipatedContests;