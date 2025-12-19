const EditContest = () => {
    return (
        <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-base-content">
                Edit contest
            </h2>
            <p className="text-sm text-base-content/70">
                This page will show a pre-filled form for a contest that is still
                pending, allowing you to update details before approval.
            </p>
            <div className="rounded-2xl bg-base-100 border border-base-300 p-4 text-sm text-base-content/70">
                Editable contest form synced with your contest data.
            </div>
        </section>
    );
};

export default EditContest;