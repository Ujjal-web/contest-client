import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useUserRole from "../../../hooks/useUserRole";

const CreatorSubmissions = () => {
    const { contestId } = useParams();
    const { isCreator } = useUserRole();
    const axiosSecure = useAxiosSecure();

    const [selectedSubmission, setSelectedSubmission] = useState(null);

    // Fetch contest details (for name, deadline, winner info)
    const {
        data: contest,
        isLoading: contestLoading,
        isError: contestError,
        refetch: refetchContest,
    } = useQuery({
        queryKey: ["contest", contestId],
        enabled: !!contestId && isCreator,
        queryFn: async () => {
            const res = await axiosSecure.get(`/contests/${contestId}`);
            return res.data;
        },
    });

    // Fetch submissions for this contest
    const {
        data: submissions = [],
        isLoading: submissionsLoading,
        isError: submissionsError,
        refetch: refetchSubmissions,
    } = useQuery({
        queryKey: ["creator-submissions", contestId],
        enabled: !!contestId && isCreator,
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/creator/contests/${contestId}/submissions`
            );
            return res.data;
        },
    });

    const isLoading = contestLoading || submissionsLoading;
    const isError = contestError || submissionsError;

    const contestDeadline = contest?.deadline
        ? new Date(contest.deadline)
        : null;
    const now = new Date();
    const isContestEnded =
        contestDeadline && contestDeadline.getTime() < now.getTime();

    const hasWinner =
        contest?.winnerSubmissionId ||
        submissions.some((s) => s.isWinner === true);

    const handleDeclareWinner = async (submission) => {
        if (!isContestEnded) {
            Swal.fire({
                icon: "info",
                title: "Too early to declare winner",
                text: "You can declare a winner only after the contest deadline has passed.",
            });
            return;
        }

        if (hasWinner) {
            Swal.fire({
                icon: "info",
                title: "Winner already declared",
                text: "This contest already has a winner. You cannot declare another one.",
            });
            return;
        }

        const result = await Swal.fire({
            title: "Declare this submission as winner?",
            text: `Participant: ${submission.userName || submission.userEmail
                }`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, declare winner",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#16a34a",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await axiosSecure.patch(
                `/creator/submissions/${submission._id}/winner`,
                { contestId }
            );

            if (res.data.modifiedCount > 0) {
                await Promise.all([refetchContest(), refetchSubmissions()]);
                Swal.fire({
                    icon: "success",
                    title: "Winner declared",
                    text: `${submission.userName || submission.userEmail
                        } is now the winner of this contest.`,
                    timer: 2200,
                    showConfirmButton: false,
                });
            } else {
                Swal.fire({
                    icon: "info",
                    title: "No change",
                    text:
                        "The winner status did not update. It may already have a winner or something went wrong.",
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Failed to declare winner",
                text: "Unable to update winner. Please try again.",
            });
        }
    };

    if (!isCreator) {
        return (
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-base-content">
                    Contest submissions
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
                    Contest submissions
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
                    Contest submissions
                </h2>
                <p className="text-sm text-error">
                    Failed to load this contest or its submissions. It may not exist or
                    you may not have permission to view it.
                </p>
            </section>
        );
    }

    return (
        <section className="space-y-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-base-content">
                        Contest submissions
                    </h2>
                    <p className="text-sm text-base-content/70">
                        Review all submitted tasks for{" "}
                        <span className="font-semibold">
                            {contest.name || contest.title}
                        </span>{" "}
                        and declare a single winner once the deadline has passed.
                    </p>
                    <p className="mt-1 text-xs text-base-content/60">
                        Deadline:{" "}
                        <span className="font-medium">
                            {contestDeadline
                                ? contestDeadline.toLocaleDateString()
                                : "Not set"}
                        </span>{" "}
                        · Status:{" "}
                        <span className="font-medium">
                            {isContestEnded ? "Ended" : "Running"}
                        </span>{" "}
                        · Winner:{" "}
                        <span className="font-medium">
                            {hasWinner ? "Already declared" : "Not declared"}
                        </span>
                    </p>
                </div>
                <div className="text-xs text-base-content/60">
                    <p>
                        Total submissions:{" "}
                        <span className="font-semibold">{submissions.length}</span>
                    </p>
                    {!isContestEnded && (
                        <p className="text-warning mt-1">
                            Winner actions unlock after the deadline.
                        </p>
                    )}
                </div>
            </div>

            {/* Submissions table */}
            <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-100">
                <table className="table table-xs md:table-sm lg:table-md">
                    <thead>
                        <tr className="text-xs md:text-sm text-base-content/70">
                            <th>#</th>
                            <th>Participant</th>
                            <th className="hidden md:table-cell">Submitted at</th>
                            <th>Status</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.map((sub, idx) => {
                            const createdAt = sub.submittedAt
                                ? new Date(sub.submittedAt)
                                : null;
                            const isWinner = sub.isWinner === true;

                            return (
                                <tr key={sub._id} className="text-xs md:text-sm">
                                    <td>{idx + 1}</td>
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-base-content">
                                                {sub.userName || "Participant"}
                                            </span>
                                            <span className="text-[11px] text-base-content/60">
                                                {sub.userEmail}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="hidden md:table-cell">
                                        <span className="text-xs">
                                            {createdAt
                                                ? `${createdAt.toLocaleDateString()} ${createdAt.toLocaleTimeString()}`
                                                : "Unknown"}
                                        </span>
                                    </td>
                                    <td>
                                        {isWinner ? (
                                            <span className="badge badge-success badge-xs md:badge-sm">
                                                Winner
                                            </span>
                                        ) : (
                                            <span className="badge badge-outline badge-xs md:badge-sm">
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="flex flex-wrap justify-center gap-1">
                                            {/* View details */}
                                            <button
                                                className="btn btn-xs btn-ghost border border-base-300 text-xs"
                                                onClick={() => setSelectedSubmission(sub)}
                                            >
                                                View
                                            </button>

                                            {/* Declare winner */}
                                            <button
                                                className="btn btn-xs btn-success text-xs text-white"
                                                disabled={isWinner || hasWinner}
                                                onClick={() => handleDeclareWinner(sub)}
                                            >
                                                Declare winner
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {submissions.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center text-sm py-8">
                                    No submissions have been received for this contest yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Submission details modal */}
            <SubmissionDetailsModal
                submission={selectedSubmission}
                onClose={() => setSelectedSubmission(null)}
            />
        </section>
    );
};

export default CreatorSubmissions;

/* ---------- Modal component for viewing a submission ---------- */

const SubmissionDetailsModal = ({ submission, onClose }) => {
    if (!submission) return null;

    const createdAt = submission.submittedAt
        ? new Date(submission.submittedAt)
        : null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
            <div className="max-w-lg w-full bg-base-100 rounded-2xl shadow-xl border border-base-300">
                <div className="px-5 py-4 border-b border-base-300 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-base-content">
                            Submission details
                        </h3>
                        <p className="text-[11px] text-base-content/60">
                            Review the content provided by this participant.
                        </p>
                    </div>
                    <button
                        className="btn btn-ghost btn-xs"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <div className="px-5 py-4 space-y-3 text-sm">
                    <div>
                        <p className="text-xs text-base-content/60">Participant</p>
                        <p className="font-medium text-base-content">
                            {submission.userName || "Participant"}
                        </p>
                        <p className="text-xs text-base-content/70">
                            {submission.userEmail}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-base-content/60">Submitted at</p>
                        <p className="text-xs text-base-content/80">
                            {createdAt
                                ? `${createdAt.toLocaleDateString()} ${createdAt.toLocaleTimeString()}`
                                : "Unknown"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-base-content/60 mb-1">
                            Submitted task / content
                        </p>
                        <div className="rounded-xl bg-base-200/80 p-3 max-h-60 overflow-y-auto text-xs md:text-sm whitespace-pre-wrap wrap-break-word">
                            {submission.content || "No details provided."}
                        </div>
                    </div>
                </div>

                <div className="px-5 py-3 border-t border-base-300 flex justify-end">
                    <button className="btn btn-sm" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};