// src/pages/Dashboard/Admin/ManageContests.jsx
const ManageContests = () => {
    return (
        <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-base-content">
                Manage contests
            </h2>
            <p className="text-sm text-base-content/70">
                Admins approve or reject contests and can delete any contest from
                this table.
            </p>
            <div className="rounded-2xl bg-base-100 border border-base-300 p-4 text-sm text-base-content/70">
                Contest management table with Confirm, Reject, and
                Delete actions.
            </div>
        </section>
    );
};

export default ManageContests;