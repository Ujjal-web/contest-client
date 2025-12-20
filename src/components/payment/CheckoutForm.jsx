import { useState } from "react";
import {
    useStripe,
    useElements,
    PaymentElement,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const CheckoutForm = ({ contest }) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState("");
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!stripe || !elements) {
            setErrorMessage("Payment is not ready yet. Please wait a moment.");
            return;
        }

        setProcessing(true);

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    // return_url: window.location.origin, // not needed if using redirect: 'if_required'
                },
                redirect: "if_required",
            });

            if (error) {
                setErrorMessage(error.message || "Payment failed");
                setProcessing(false);
                return;
            }

            if (paymentIntent && paymentIntent.status === "succeeded") {
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
            setErrorMessage("Something went wrong. Please try again.");
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <PaymentElement />

            {errorMessage && (
                <p className="text-xs text-error mt-1">{errorMessage}</p>
            )}

            <button
                type="submit"
                disabled={!stripe || processing}
                className="btn btn-primary btn-sm w-full mt-1"
            >
                {processing ? (
                    <span className="loading loading-spinner loading-sm" />
                ) : (
                    `Pay $${contest.price?.toFixed(2)}`
                )}
            </button>

            <p className="text-[11px] text-base-content/60 mt-1">
                Testing: use card 4242 4242 4242 4242 · Any future date · Any CVC.
            </p>
        </form>
    );
};

export default CheckoutForm;