const AddContest = () => {
    return (
        <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-base-content">
                Add new contest
            </h2>
            <p className="text-sm text-base-content/70">
                This page will contain a full form with name, image, price, prize
                money, contest type, deadline, and task instructions.
            </p>
            <div className="rounded-2xl bg-base-100 border border-base-300 p-4 text-sm text-base-content/70">
                contest creation form with react-hook-form and
                react-datepicker.
            </div>
        </section>
    );
};

export default AddContest;