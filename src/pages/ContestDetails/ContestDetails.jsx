import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const ContestDetails = () => {
    const { contestId } = useParams();
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth() || {};

    // Contest details
    const {
        data: contest,
        isLoading: contestLoading,
        isError: contestError,
    } = useQuery({
        queryKey: ["contest-details", contestId],
        enabled: !!contestId,
        queryFn: async () => {
            const res = await axiosPublic.get(`/contests/${contestId}`);
            return res.data;
        },
    });

    // Registration status
    const {
        data: registration,
        isLoading: regLoading,
        isError: regError,
    } = useQuery({
        queryKey: ["contest-registration", contestId],
        enabled: !!contestId && !!user,
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/payments/registered/${contestId}`
            );
            return res.data; // { registered: boolean }
        },
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [remaining, setRemaining] = useState(null);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // Countdown
    useEffect(() => {
        if (!contest?.deadline) return;

        const deadlineDate = new Date(contest.deadline);

        const tick = () => {
            const now = new Date();
            const diff = deadlineDate.getTime() - now.getTime();
            if (diff <= 0) {
                setRemaining(0);
                return;
            }
            setRemaining(diff);
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [contest?.deadline]);

    if (contestLoading || regLoading) {
        return (
            <section className="min-h-50 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary" />
            </section>
        );
    }

    if (contestError || !contest) {
        return (
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-base-content">
                    Contest details
                </h2>
                <p className="text-sm text-error">
                    Failed to load this contest. It may not exist or you may not have
                    permission to view it.
                </p>
            </section>
        );
    }

    const {
        _id,
        name,
        title,
        image,
        description,
        taskInstruction,
        prizeMoney,
        type,
        price,
        participationCount,
        participantsCount,
        winnerUserName,
        winnerUserPhoto,
        winnerUserEmail,
        deadline,
    } = contest;

    const displayName = name || title || "Contest";
    const participants = participantsCount ?? participationCount ?? 0;
    const isRegistered = registration?.registered && !regError;
    const deadlineDate = deadline ? new Date(deadline) : null;
    const isEnded =
        deadlineDate && deadlineDate.getTime() <= new Date().getTime();

    const handleGoToPayment = () => {
        if (user) {
            navigate(`/payment/${_id}`);
        } else {
            navigate(`/login`, { state: { from: `/payment/${_id}` } });
        }
    };

    const handleSubmitTask = async (content) => {
        try {
            const payload = {
                content,
                userName: user?.displayName,
            };
            const res = await axiosSecure.post(
                `/contests/${_id}/submissions`,
                payload
            );

            if (res.data.insertedId || res.data.acknowledged) {
                Swal.fire({
                    icon: "success",
                    title: "Task submitted",
                    text: "Your submission has been sent to the contest creator.",
                    timer: 2000,
                    showConfirmButton: false,
                });
                setIsModalOpen(false);
                setHasSubmitted(true);
            } else {
                Swal.fire({
                    icon: "info",
                    title: "Not submitted",
                    text: "Something went wrong. Please try again.",
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Submission failed",
                text: "Unable to submit your task. Please try again.",
            });
        }
    };

    return (
        <section className="space-y-6">
            {/* Header / Banner */}
            <div className="rounded-3xl overflow-hidden border border-base-300 bg-base-100 shadow-sm">
                {image && (
                    <div className="h-52 md:h-64 lg:h-72 overflow-hidden">
                        <img
                            src={image}
                            alt={displayName}
                            className="h-full w-full object-cover"
                        />
                    </div>
                )}
                <div className="p-4 md:p-6 space-y-3">
                    <div className="flex flex-wrap items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                            <span className="badge badge-outline badge-sm capitalize">
                                {type || "Open"}
                            </span>
                            <span className="badge badge-sm">
                                Participants: {participants}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs md:text-sm">
                            {typeof price === "number" && (
                                <span className="badge badge-outline badge-sm">
                                    Entry fee: ${price.toFixed(2)}
                                </span>
                            )}
                            {typeof prizeMoney === "number" && (
                                <span className="badge badge-primary badge-sm">
                                    Prize: ${prizeMoney.toFixed(2)}
                                </span>
                            )}
                        </div>
                    </div>

                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-base-content">
                        {displayName}
                    </h1>

                    {/* Countdown + Status */}
                    <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-base-content/80">
                        {deadlineDate && (
                            <div className="flex items-center gap-1">
                                <span className="font-medium">Deadline:</span>
                                <span>{deadlineDate.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Status:</span>
                            {isEnded ? (
                                <span className="badge badge-error badge-sm">
                                    Contest ended
                                </span>
                            ) : (
                                <span className="badge badge-success badge-sm">
                                    Running
                                </span>
                            )}
                        </div>
                        {!isEnded && remaining !== null && (
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Time left:</span>
                                <CountdownDisplay ms={remaining} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content layout */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left: description + task */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="rounded-2xl bg-base-100 border border-base-300 p-4 space-y-2">
                        <h3 className="text-sm font-semibold text-base-content">
                            Contest description
                        </h3>
                        <p className="text-sm text-base-content/80 whitespace-pre-line">
                            {description || "No description provided for this contest."}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-base-100 border border-base-300 p-4 space-y-2">
                        <h3 className="text-sm font-semibold text-base-content">
                            Task details
                        </h3>
                        <p className="text-sm text-base-content/80 whitespace-pre-line">
                            {taskInstruction ||
                                "The creator has not shared specific task instructions yet."}
                        </p>
                    </div>
                </div>

                {/* Right: winner info + actions */}
                <div className="space-y-4">
                    {/* Winner Info */}
                    <div className="rounded-2xl bg-base-100 border border-base-300 p-4 space-y-2">
                        <h3 className="text-sm font-semibold text-base-content">
                            Winner
                        </h3>
                        {winnerUserName ? (
                            <div className="flex items-center gap-3">
                                <div className="avatar">
                                    <div className="w-10 rounded-full border border-base-300">
                                        <img
                                            src={
                                                winnerUserPhoto ||
                                                "https://i.ibb.co/YfGbxwG/default-avatar.png"
                                            }
                                            alt={winnerUserName}
                                        />
                                    </div>
                                </div>
                                <div className="text-xs text-base-content/80">
                                    <p className="font-semibold text-base-content">
                                        {winnerUserName}
                                    </p>
                                    <p className="text-[11px]">
                                        {winnerUserEmail || "Winner of this contest"}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-base-content/70">
                                The winner has not been declared yet. Check back after the
                                contest ends.
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="rounded-2xl bg-base-100 border border-base-300 p-4 space-y-3">
                        <h3 className="text-sm font-semibold text-base-content">
                            Participation
                        </h3>

                        {!isRegistered ? (
                            <p className="text-xs text-base-content/70">
                                Pay the entry fee to register for this contest. After payment
                                you will be able to submit your task.
                            </p>
                        ) : (
                            <p className="text-xs text-base-content/70">
                                You are registered for this contest. Submit your task before the
                                deadline.
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={handleGoToPayment}
                            disabled={isEnded || isRegistered}
                            className="btn btn-primary btn-sm w-full"
                        >
                            {isEnded
                                ? "Contest ended"
                                : isRegistered
                                    ? "Already registered"
                                    : user
                                        ? "Pay to Register"
                                        : "Login to Participate"}
                        </button>

                        {/* Submit task button */}
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            disabled={!isRegistered || isEnded || hasSubmitted}
                            className={`btn btn-sm w-full ${hasSubmitted ? "btn-success btn-outline" : "btn-outline"
                                }`}
                        >
                            {hasSubmitted ? "Task submitted" : "Submit task"}
                        </button>

                        {!isRegistered && (
                            <p className="text-[11px] text-base-content/60 mt-1">
                                You must complete the payment before you can submit a task.
                            </p>
                        )}
                        {isEnded && (
                            <p className="text-[11px] text-error mt-1">
                                Task submission is closed because the contest has ended.
                            </p>
                        )}
                        {hasSubmitted && !isEnded && (
                            <p className="text-[11px] text-success mt-1">
                                Your task has been submitted. You cannot submit again for this
                                contest.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal for submit task */}
            {isModalOpen && (
                <SubmitTaskModal
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmitTask}
                />
            )}
        </section>
    );
};

export default ContestDetails;

/* ---------- Countdown display helper ---------- */

const CountdownDisplay = ({ ms }) => {
    if (ms <= 0) {
        return <span className="text-error text-xs">Contest ended</span>;
    }

    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return (
        <span className="text-xs text-base-content/80">
            {days > 0 && `${days}d `} {hours}h {minutes}m {seconds}s
        </span>
    );
};

/* ---------- Submit Task Modal ---------- */

const SubmitTaskModal = ({ onClose, onSubmit }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm();

    const handleFormSubmit = async (data) => {
        await onSubmit(data.content);
        reset();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
            <div className="max-w-lg w-full bg-base-100 rounded-2xl shadow-xl border border-base-300">
                <div className="px-5 py-4 border-b border-base-300 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-base-content">
                            Submit your task
                        </h3>
                        <p className="text-[11px] text-base-content/60">
                            Paste links or notes for your work and send it to the creator.
                        </p>
                    </div>
                    <button
                        className="btn btn-ghost btn-xs"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className="px-5 py-4 space-y-3 text-sm"
                >
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-sm leading-tight">
                                <span className="block">Submission details</span>
                                <span className="block text-xs text-base-content/60">
                                    Provide URLs and any explanation needed for your entry.
                                </span>
                            </span>
                        </label>
                        <textarea
                            rows={6}
                            className="textarea textarea-bordered w-full text-sm"
                            placeholder="Example: Link to your design, article, or demo, plus important notes..."
                            {...register("content", {
                                required: "Submission content is required",
                                minLength: {
                                    value: 10,
                                    message:
                                        "Please provide at least a few words or a valid URL.",
                                },
                            })}
                        />
                        {errors.content && (
                            <p className="text-xs text-error mt-1">
                                {errors.content.message}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary btn-sm"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="loading loading-spinner loading-sm" />
                            ) : (
                                "Submit task"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};