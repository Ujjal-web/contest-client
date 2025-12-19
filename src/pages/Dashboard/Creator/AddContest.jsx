import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import useUserRole from "../../../hooks/useUserRole";
import ContestForm from "../../../components/dashboard/ContestForm";

const AddContest = () => {
    const { user } = useAuth() || {};
    const { isCreator } = useUserRole();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const handleCreate = async (values) => {
        try {
            const contest = {
                ...values,
                creatorEmail: user?.email,
                creatorName: user?.displayName || user?.email,
            };

            const res = await axiosSecure.post("/contests", contest);

            if (res.data.insertedId || res.data.acknowledged) {
                await Swal.fire({
                    icon: "success",
                    title: "Contest created",
                    text: "Your contest is now pending admin approval.",
                    timer: 2200,
                    showConfirmButton: false,
                });

                navigate("/dashboard/creator/my-contests");
            } else {
                Swal.fire({
                    icon: "info",
                    title: "Contest not created",
                    text: "Something went wrong. Please try again.",
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Failed to create contest",
                text: "Unable to save your contest. Please try again.",
            });
        }
    };

    if (!isCreator) {
        return (
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-base-content">
                    Add new contest
                </h2>
                <p className="text-sm text-error">
                    You do not have Contest Creator permissions. Ask an admin to promote
                    your account to creator.
                </p>
            </section>
        );
    }

    return (
        <section className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-base-content">
                        Add new contest
                    </h2>
                    <p className="text-sm text-base-content/70 max-w-2xl">
                        Design a clear and attractive contest. Set the entry fee, prize
                        amount, deadline, and task instructions so participants know exactly
                        what to submit.
                    </p>
                </div>
            </div>

            <div className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body">
                    <ContestForm mode="create" onSubmit={handleCreate} />
                </div>
            </div>
        </section>
    );
};

export default AddContest;