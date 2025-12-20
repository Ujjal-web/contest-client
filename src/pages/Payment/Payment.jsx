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

    // Load contest
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
                // console.log("ClientSecret:", res.data.clientSecret);
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: "error",
                    title: "Payment error",
                    text: "Unable to start payment. Please try again.",
                });
            }
        };

        if (contest) {
            createIntent();
        }
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

    return (
        <section className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-base-content">
                Register for contest
            </h2>
            <p className="text-sm text-base-content/70">
                You are about to register for{" "}
                <span className="font-semibold">
                    {contest.name || contest.title}
                </span>
                . After a successful payment, you will be able to submit your task from
                the contest page.
            </p>

            <div className="rounded-2xl bg-base-100 border border-base-300 p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-base-content">
                        Entry fee
                    </span>
                    <span className="font-semibold text-base-content">
                        ${contest.price?.toFixed(2)}
                    </span>
                </div>
                {deadlineDate && (
                    <p className="text-xs text-base-content/60">
                        Deadline: {deadlineDate.toLocaleString()}
                    </p>
                )}
            </div>

            <div className="rounded-2xl bg-base-100 border border-base-300 p-4">
                {clientSecret ? (
                    <Elements
                        stripe={stripePromise}
                        options={{ clientSecret, appearance: { theme: "stripe" } }}
                    >
                        <CheckoutForm contest={contest} clientSecret={clientSecret} />
                    </Elements>
                ) : (
                    <p className="text-sm text-base-content/70">
                        Preparing secure payment form…
                    </p>
                )}
            </div>
        </section>
    );
};

export default Payment;