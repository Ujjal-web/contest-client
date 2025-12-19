// src/pages/Dashboard/Creator/EditContest.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useUserRole from "../../../hooks/useUserRole";
import ContestForm from "../../../components/dashboard/ContestForm";

const EditContest = () => {
    const { contestId } = useParams();   // <-- key change
    const { isCreator } = useUserRole();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const {
        data: contest,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["contest", contestId],
        enabled: !!contestId && isCreator,
        queryFn: async () => {
            const res = await axiosSecure.get(`/contests/${contestId}`);
            return res.data;
        },
    });

    const handleUpdate = async (values) => {
        try {
            const res = await axiosSecure.patch(
                `/creator/contests/${contestId}`,
                values
            );

            if (res.data.modifiedCount > 0) {
                await Swal.fire({
                    icon: "success",
                    title: "Contest updated",
                    text: "Your pending contest has been updated successfully.",
                    timer: 2200,
                    showConfirmButton: false,
                });

                navigate("/dashboard/creator/my-contests");
            } else {
                Swal.fire({
                    icon: "info",
                    title: "No changes saved",
                    text:
                        "Either nothing changed, or this contest is no longer editable (not pending).",
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Update failed",
                text: "Unable to update this contest. Please try again.",
            });
        }
    };

    if (!isCreator) {
        return (
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-base-content">
                    Edit contest
                </h2>
                <p className="text-sm text-error">
                    You do not have Contest Creator permissions. Ask an admin to promote
                    your account to creator.
                </p>
            </section>
        );
    }

    if (isLoading) {
        return (
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-base-content">
                    Edit contest
                </h2>
                <div className="min-h-50 flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg text-primary" />
                </div>
            </section>
        );
    }

    if (isError || !contest) {
        return (
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-base-content">
                    Edit contest
                </h2>
                <p className="text-sm text-error">
                    Failed to load this contest. It may not exist or you may not have
                    permission.
                </p>
            </section>
        );
    }

    return (
        <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-base-content">
                Edit contest
            </h2>
            <p className="text-sm text-base-content/70 max-w-2xl">
                You can only edit contests that are still pending approval. Approved or
                rejected contests are locked.
            </p>

            <div className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body">
                    <ContestForm
                        mode="edit"
                        initialData={contest}
                        onSubmit={handleUpdate}
                    />
                </div>
            </div>
        </section>
    );
};

export default EditContest;