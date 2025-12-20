import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const cardElementStyle = {
    style: {
        base: {
            fontSize: "14px",
            color: "#111827",
            "::placeholder": { color: "#9ca3af" },
        },
        invalid: { color: "#ef4444" },
    },
};

const CheckoutForm = ({ contest, clientSecret }) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [cardError, setCardError] = useState("");
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCardError("");

        if (!stripe || !elements || !clientSecret) {
            setCardError("Payment is not ready yet. Please wait a moment.");
            return;
        }

        const card = elements.getElement(CardElement);
        if (!card) return;

        setProcessing(true);

        try {
            const { error, paymentIntent } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: { card },
                }
            );

            if (error) {
                console.error(error);
                setCardError(error.message || "Payment failed");
                setProcessing(false);
                return;
            }

            if (paymentIntent.status === "succeeded") {
                const paymentInfo = {
                    contestId: contest._id,
                    amount: contest.price,
                    transactionId: paymentIntent.id,
                };

                const res = await axiosSecure.post("/payments", paymentInfo);

                if (res.data?.paymentResult?.insertedId) {
                    Swal.fire({
                        icon: "success",
                        title: "Payment successful",
                        text: "You are registered for this contest.",
                        timer: 2200,
                        showConfirmButton: false,
                    });

                    navigate(`/contests/${contest._id}`, { replace: true });
                } else {
                    Swal.fire({
                        icon: "info",
                        title: "Payment recorded",
                        text:
                            "Payment succeeded but we could not fully record it. Please contact support if anything looks wrong.",
                    });
                }
            }

            setProcessing(false);
        } catch (err) {
            console.error(err);
            setCardError("Something went wrong. Please try again.");
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="form-control">
                <label className="label">
                    <span className="label-text text-sm leading-tight">
                        <span className="block">Card details</span>
                        <span className="block text-xs text-base-content/60">
                            Use Stripe test card 4242 4242 4242 4242 · Any future date · Any
                            CVC.
                        </span>
                    </span>
                </label>
                <div className="border border-base-300 rounded-lg px-3 py-2 bg-base-100">
                    <CardElement options={cardElementStyle} />
                </div>
            </div>

            {cardError && (
                <p className="text-xs text-error mt-1">{cardError}</p>
            )}

            <button
                type="submit"
                className="btn btn-primary btn-sm mt-2 w-full"
                disabled={!stripe || processing || !clientSecret}
            >
                {processing ? (
                    <span className="loading loading-spinner loading-sm" />
                ) : (
                    `Pay $${contest.price?.toFixed(2)}`
                )}
            </button>
        </form>
    );
};

export default CheckoutForm;