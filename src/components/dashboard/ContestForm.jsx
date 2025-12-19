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

    // When initialData arrives (Edit), update the form & deadline
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
            className="grid gap-4 md:grid-cols-2"
        >
            {/* Name */}
            <div className="form-control md:col-span-2">
                <label className="label">
                    <span className="label-text text-sm leading-tight">
                        <span className="block">Contest name</span>
                        <span className="block text-xs text-base-content/60">
                            Choose a clear, attractive title that tells participants what this
                            contest is about.
                        </span>
                    </span>
                </label>
                <input
                    type="text"
                    placeholder="e.g. Minimal logo redesign challenge"
                    className="input input-bordered"
                    {...register("name", { required: "Contest name is required" })}
                />
                {errors.name && (
                    <p className="text-xs text-error mt-1">{errors.name.message}</p>
                )}
            </div>

            {/* Image URL */}
            <div className="form-control md:col-span-2">
                <label className="label">
                    <span className="label-text text-sm leading-tight">
                        <span className="block">Banner image URL</span>
                        <span className="block text-xs text-base-content/60">
                            Image shown on contest cards and details page. Use a landscape
                            image for best results.
                        </span>
                    </span>
                </label>
                <input
                    type="text"
                    placeholder="https://your-image-link.com/banner.jpg"
                    className="input input-bordered"
                    {...register("image", { required: "Image URL is required" })}
                />
                {errors.image && (
                    <p className="text-xs text-error mt-1">{errors.image.message}</p>
                )}
            </div>

            {/* Description */}
            <div className="form-control md:col-span-2">
                <label className="label">
                    <span className="label-text text-sm leading-tight">
                        <span className="block">Short description</span>
                        <span className="block text-xs text-base-content/60">
                            A brief overview that appears in lists. Describe what the contest
                            is about in 2–3 sentences.
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

            {/* Price (entry fee) */}
            <div className="form-control">
                <label className="label">
                    <span className="label-text text-sm leading-tight">
                        <span className="block">Entry fee (USD)</span>
                        <span className="block text-xs text-base-content/60">
                            How much participants pay to join this contest.
                        </span>
                    </span>
                </label>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="e.g. 10"
                    className="input input-bordered"
                    {...register("price", {
                        required: "Entry fee is required",
                        min: {
                            value: 0,
                            message: "Entry fee cannot be negative",
                        },
                    })}
                />
                {errors.price && (
                    <p className="text-xs text-error mt-1">{errors.price.message}</p>
                )}
            </div>

            {/* Prize money */}
            <div className="form-control">
                <label className="label">
                    <span className="label-text text-sm leading-tight">
                        <span className="block">Prize money (USD)</span>
                        <span className="block text-xs text-base-content/60">
                            The amount the winner receives for this contest.
                        </span>
                    </span>
                </label>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="e.g. 150"
                    className="input input-bordered"
                    {...register("prizeMoney", {
                        required: "Prize money is required",
                        min: {
                            value: 1,
                            message: "Prize money should be at least $1",
                        },
                    })}
                />
                {errors.prizeMoney && (
                    <p className="text-xs text-error mt-1">
                        {errors.prizeMoney.message}
                    </p>
                )}
            </div>

            {/* Contest type */}
            <div className="form-control">
                <label className="label">
                    <span className="label-text text-sm leading-tight">
                        <span className="block">Contest type</span>
                        <span className="block text-xs text-base-content/60">
                            This helps participants find contests they are interested in.
                        </span>
                    </span>
                </label>
                <select
                    className="select select-bordered"
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
                    <p className="text-xs text-error mt-1">{errors.type.message}</p>
                )}
            </div>

            {/* Deadline (DatePicker) */}
            <div className="form-control">
                <label className="label">
                    <span className="label-text text-sm leading-tight">
                        <span className="block">Deadline</span>
                        <span className="block text-xs text-base-content/60">
                            After this date, participants can no longer submit tasks and you
                            can declare a winner.
                        </span>
                    </span>
                </label>
                <div className="input input-bordered p-0 flex items-center">
                    <DatePicker
                        selected={deadline}
                        onChange={(date) => setDeadline(date)}
                        minDate={new Date()}
                        placeholderText="Select a deadline date"
                        className="w-full px-3 py-2 bg-transparent outline-none text-sm"
                        dateFormat="yyyy-MM-dd"
                    />
                </div>
            </div>

            {/* Task instructions */}
            <div className="form-control md:col-span-2">
                <label className="label">
                    <span className="label-text text-sm leading-tight">
                        <span className="block">Task instructions</span>
                        <span className="block text-xs text-base-content/60">
                            Explain exactly what participants must submit (file types, links,
                            word counts, formats, etc.).
                        </span>
                    </span>
                </label>
                <textarea
                    rows={4}
                    className="textarea textarea-bordered"
                    placeholder="Describe what participants must do and how you will evaluate their work..."
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

            {/* Submit button */}
            <div className="md:col-span-2 flex justify-end pt-2">
                <button
                    type="submit"
                    className="btn btn-primary"
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

export default ContestForm;