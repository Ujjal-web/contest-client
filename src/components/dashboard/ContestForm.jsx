import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";

/**
 * ContestForm
 *
 * Props:
 * - mode: "create" | "edit"
 * - initialData: contest object for edit (optional)
 * - onSubmit: async (values) => void
 */
const ContestForm = ({ mode = "create", initialData, onSubmit }) => {
    const [deadline, setDeadline] = useState(
        initialData?.deadline ? new Date(initialData.deadline) : null
    );

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: {
            name: initialData?.name || "",
            image: initialData?.image || "",
            description: initialData?.description || "",
            price:
                typeof initialData?.price === "number" ? initialData.price : "",
            prizeMoney:
                typeof initialData?.prizeMoney === "number"
                    ? initialData.prizeMoney
                    : "",
            taskInstruction: initialData?.taskInstruction || "",
            type: initialData?.type || "",
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name || "",
                image: initialData.image || "",
                description: initialData.description || "",
                price:
                    typeof initialData.price === "number" ? initialData.price : "",
                prizeMoney:
                    typeof initialData.prizeMoney === "number"
                        ? initialData.prizeMoney
                        : "",
                taskInstruction: initialData.taskInstruction || "",
                type: initialData.type || "",
            });
            setDeadline(
                initialData.deadline ? new Date(initialData.deadline) : null
            );
        }
    }, [initialData, reset]);

    const handleFormSubmit = async (values) => {
        if (!deadline) {
            Swal.fire({
                icon: "warning",
                title: "Deadline required",
                text: "Please choose a deadline for this contest.",
            });
            return;
        }

        const payload = {
            ...values,
            price: parseFloat(values.price),
            prizeMoney: parseFloat(values.prizeMoney),
            deadline,
        };

        await onSubmit(payload);
    };

    const isEdit = mode === "edit";
    const submitLabel = isEdit ? "Update contest" : "Create contest";

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-6"
        >
            {/* Top layout: left (overview) / right (settings) */}
            <div className="grid gap-5 lg:grid-cols-3">
                {/* Left: overview & instructions */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Section header */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-base-content/70">
                            Contest overview
                        </h3>
                    </div>

                    <div className="rounded-2xl border border-base-300 bg-base-100/80 p-4 space-y-4">
                        {/* Name */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-sm leading-tight">
                                    <span className="block">Contest name</span>
                                    <span className="block text-xs text-base-content/60">
                                        Title shown on cards and the contest details page.
                                    </span>
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="Minimal logo redesign challenge"
                                className="input input-bordered"
                                {...register("name", {
                                    required: "Contest name is required",
                                })}
                            />
                            {errors.name && (
                                <p className="text-xs text-error mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Image URL */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-sm leading-tight">
                                    <span className="block">Banner image URL</span>
                                    <span className="block text-xs text-base-content/60">
                                        Landscape image used in the contest card and header.
                                    </span>
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="https://your-image-link.com/banner.jpg"
                                className="input input-bordered"
                                {...register("image", {
                                    required: "Image URL is required",
                                })}
                            />
                            {errors.image && (
                                <p className="text-xs text-error mt-1">
                                    {errors.image.message}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-sm leading-tight">
                                    <span className="block">Short description</span>
                                    <span className="block text-xs text-base-content/60">
                                        A few sentences explaining what this contest is about.
                                    </span>
                                </span>
                            </label>
                            <textarea
                                rows={3}
                                className="textarea textarea-bordered"
                                placeholder="Describe the purpose and theme of this contest..."
                                {...register("description", {
                                    required: "Description is required",
                                })}
                            />
                            {errors.description && (
                                <p className="text-xs text-error mt-1">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Instructions box */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-base-content/70 mb-1">
                            Task instructions
                        </h3>
                        <div className="rounded-2xl border border-base-300 bg-base-100/80 p-4">
                            <label className="label px-0 pt-0">
                                <span className="label-text text-sm leading-tight">
                                    <span className="block">What to submit</span>
                                    <span className="block text-xs text-base-content/60">
                                        Tell participants what format and content their submission
                                        should have.
                                    </span>
                                </span>
                            </label>
                            <textarea
                                rows={5}
                                className="textarea textarea-bordered w-full"
                                placeholder="Explain exactly what participants must submit..."
                                {...register("taskInstruction", {
                                    required: "Task instruction is required",
                                })}
                            />
                            {errors.taskInstruction && (
                                <p className="text-xs text-error mt-1">
                                    {errors.taskInstruction.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: contest settings */}
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-base-content/70">
                            Contest settings
                        </h3>
                    </div>

                    <div className="rounded-2xl border border-base-300 bg-base-200/80 p-4 space-y-3">
                        {/* Contest type */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-sm leading-tight">
                                    <span className="block">Contest type</span>
                                    <span className="block text-xs text-base-content/60">
                                        Category used for filtering and search.
                                    </span>
                                </span>
                            </label>
                            <select
                                className="select select-bordered select-sm"
                                defaultValue={initialData?.type || ""}
                                {...register("type", {
                                    required: "Contest type is required",
                                })}
                            >
                                <option value="" disabled>
                                    Select contest type
                                </option>
                                <option value="Image Design">Image Design</option>
                                <option value="Logo Design">Logo Design</option>
                                <option value="Article Writing">Article Writing</option>
                                <option value="Business Idea">Business Idea</option>
                                <option value="Game Review">Game Review</option>
                                <option value="Photography">Photography</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.type && (
                                <p className="text-xs text-error mt-1">
                                    {errors.type.message}
                                </p>
                            )}
                        </div>

                        {/* Entry fee */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-sm leading-tight">
                                    <span className="block">Entry fee (USD)</span>
                                    <span className="block text-xs text-base-content/60">
                                        Amount each participant pays to join.
                                    </span>
                                </span>
                            </label>
                            <label className="input input-bordered input-sm flex items-center gap-2">
                                <span className="text-xs text-base-content/60">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className="grow bg-transparent outline-none text-sm"
                                    placeholder="10"
                                    {...register("price", {
                                        required: "Entry fee is required",
                                        min: {
                                            value: 0,
                                            message: "Entry fee cannot be negative",
                                        },
                                    })}
                                />
                            </label>
                            {errors.price && (
                                <p className="text-xs text-error mt-1">
                                    {errors.price.message}
                                </p>
                            )}
                        </div>

                        {/* Prize money */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-sm leading-tight">
                                    <span className="block">Prize money (USD)</span>
                                    <span className="block text-xs text-base-content/60">
                                        Amount awarded to the contest winner.
                                    </span>
                                </span>
                            </label>
                            <label className="input input-bordered input-sm flex items-center gap-2">
                                <span className="text-xs text-base-content/60">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className="grow bg-transparent outline-none text-sm"
                                    placeholder="150"
                                    {...register("prizeMoney", {
                                        required: "Prize money is required",
                                        min: {
                                            value: 1,
                                            message: "Prize money should be at least $1",
                                        },
                                    })}
                                />
                            </label>
                            {errors.prizeMoney && (
                                <p className="text-xs text-error mt-1">
                                    {errors.prizeMoney.message}
                                </p>
                            )}
                        </div>

                        {/* Deadline */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-sm leading-tight">
                                    <span className="block">Deadline</span>
                                    <span className="block text-xs text-base-content/60">
                                        Last date when participants can submit entries.
                                    </span>
                                </span>
                            </label>
                            <label className="input input-bordered input-sm flex items-center gap-2">
                                <CalendarIcon />
                                <DatePicker
                                    selected={deadline}
                                    onChange={(date) => setDeadline(date)}
                                    minDate={new Date()}
                                    placeholderText="Select date"
                                    className="grow bg-transparent outline-none text-sm"
                                    dateFormat="yyyy-MM-dd"
                                />
                            </label>
                        </div>

                        {/* Summary card */}
                        <div className="mt-3 rounded-xl bg-base-100 border border-dashed border-base-300 p-3 text-xs text-base-content/70">
                            {isEdit ? (
                                <p>
                                    You are editing a pending contest. Once admins approve or
                                    reject it, these settings become read‑only.
                                </p>
                            ) : (
                                <p>
                                    New contests start as pending. Admins review and approve them
                                    before they appear in the public list.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer actions */}
            <div className="flex justify-end border-t border-base-300 pt-4 mt-2">
                <button
                    type="submit"
                    className="btn btn-primary px-6"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                        submitLabel
                    )}
                </button>
            </div>
        </form>
    );
};

const CalendarIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-base-content/60"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.6}
            d="M8 7V3m8 4V3M4 11h16M5 5h14a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
        />
    </svg>
);

export default ContestForm;