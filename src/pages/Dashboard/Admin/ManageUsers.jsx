const ManageUsers = () => {
    return (
        <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-base-content">
                Manage users
            </h2>
            <p className="text-sm text-base-content/70">
                Admins can view all users and change roles between User, Creator,
                and Admin from this table.
            </p>
            <div className="rounded-2xl bg-base-100 border border-base-300 p-4 text-sm text-base-content/70">
                Coming soon: user management table with role change controls and
                pagination.
            </div>
        </section>
    );
};

export default ManageUsers;