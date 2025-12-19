const MyContests = () => {
    return (
        <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-base-content">
                My created contests
            </h2>
            <p className="text-sm text-base-content/70">
                Here you will see all contests you created with their status:
                Pending, Confirmed, or Rejected.
            </p>
            <div className="rounded-2xl bg-base-100 border border-base-300 p-4 text-sm text-base-content/70">
                Coming soon: table with edit, delete, and “See submissions” buttons.
            </div>
        </section>
    );
};

export default MyContests;