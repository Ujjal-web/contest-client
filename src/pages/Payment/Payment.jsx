import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Swal from "sweetalert2";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import CheckoutForm from "../../components/payment/CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const Payment = () => {
    const { contestId } = useParams();
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [clientSecret, setClientSecret] = useState("");

    const {
        data: contest,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["payment-contest", contestId],
        enabled: !!contestId,
        queryFn: async () => {
            const res = await axiosPublic.get(`/contests/${contestId}`);
            return res.data;
        },
    });

    useEffect(() => {
        const createIntent = async () => {
            if (!contest?._id || typeof contest.price !== "number") return;

            if (contest.deadline) {
                const deadline = new Date(contest.deadline);
                if (deadline.getTime() <= Date.now()) {
                    Swal.fire({
                        icon: "info",
                        title: "Contest ended",
                        text: "You can no longer register for this contest.",
                    });
                    navigate(`/contests/${contest._id}`, { replace: true });
                    return;
                }
            }

            try {
                const res = await axiosSecure.post("/payments/create-intent", {
                    contestId: contest._id,
                });
                setClientSecret(res.data.clientSecret);
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: "error",
                    title: "Payment error",
                    text: "Unable to start payment. Please try again.",
                });
            }
        };

        if (contest) createIntent();
    }, [axiosSecure, contest, navigate]);

    if (isLoading) {
        return (
            <section className="min-h-50 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary" />
            </section>
        );
    }

    if (isError || !contest) {
        return (
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-base-content">
                    Payment
                </h2>
                <p className="text-sm text-error">
                    Failed to load contest information for payment.
                </p>
            </section>
        );
    }

    const deadlineDate = contest.deadline ? new Date(contest.deadline) : null;
    const isEnded =
        deadlineDate && deadlineDate.getTime() <= Date.now();

    if (isEnded) {
        return (
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-base-content">
                    Payment
                </h2>
                <p className="text-sm text-error">
                    This contest has already ended. You can no longer register.
                </p>
            </section>
        );
    }

    const appearance = {
        theme: "stripe",
    };

    const options = {
        clientSecret,
        appearance,
    };

    return (
        <section className="space-y-6 max-w-4xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-base-content">
                Checkout
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Left: summary */}
                <div className="rounded-3xl bg-base-100 border border-base-300 p-5 space-y-3">
                    <p className="text-xs uppercase tracking-wide text-base-content/60">
                        Contest
                    </p>
                    <h3 className="text-lg font-semibold text-base-content">
                        {contest.name || contest.title}
                    </h3>
                    <p className="text-sm text-base-content/70">
                        You are registering for this contest. After payment you can submit
                        your task from the contest details page.
                    </p>

                    <div className="mt-4 border-t border-base-300 pt-3">
                        <p className="text-xs text-base-content/60 mb-1">
                            Amount to pay
                        </p>
                        <p className="text-3xl font-bold text-base-content">
                            ${contest.price?.toFixed(2)}
                        </p>
                        {deadlineDate && (
                            <p className="text-xs text-base-content/60 mt-1">
                                Deadline: {deadlineDate.toLocaleString()}
                            </p>
                        )}
                    </div>
                </div>

                {/* Right: Stripe Payment Element */}
                <div className="rounded-3xl bg-base-100 border border-base-300 p-5">
                    {clientSecret ? (
                        <Elements stripe={stripePromise} options={options}>
                            <CheckoutForm contest={contest} />
                        </Elements>
                    ) : (
                        <p className="text-sm text-base-content/70">
                            Preparing secure payment form…
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Payment;