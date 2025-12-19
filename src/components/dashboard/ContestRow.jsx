const ContestRow = ({ index, contest, onConfirm, onReject, onDelete }) => {
    const status = contest.status || "pending";

    const statusLabel =
        status === "approved"
            ? "Approved"
            : status === "rejected"
                ? "Rejected"
                : "Pending";

    const statusClass =
        status === "approved"
            ? "badge-success"
            : status === "rejected"
                ? "badge-error"
                : "badge-warning";

    return (
        <tr className="text-xs md:text-sm">
            <td>{index}</td>

            {/* Contest info */}
            <td>
                <div className="flex items-center gap-2">
                    <div className="avatar hidden sm:inline-flex">
                        <div className="w-9 h-9 rounded-lg border border-base-300">
                            <img
                                src={
                                    contest.image ||
                                    "https://via.placeholder.com/80x80?text=Contest"
                                }
                                alt={contest.name || contest.title || "Contest"}
                            />
                        </div>
                    </div>
                    <div>
                        <p className="font-medium text-base-content line-clamp-2">
                            {contest.name || contest.title || "Untitled contest"}
                        </p>
                        <p className="text-[11px] text-base-content/60">
                            Deadline:{" "}
                            {contest.deadline
                                ? new Date(contest.deadline).toLocaleDateString()
                                : "Not set"}
                        </p>
                    </div>
                </div>
            </td>

            {/* Type */}
            <td className="hidden md:table-cell capitalize">
                {contest.type || "N/A"}
            </td>

            {/* Entry price */}
            <td>
                <span className="text-xs">
                    ${contest.price ? contest.price.toFixed(2) : "0.00"}
                </span>
            </td>

            {/* Prize money */}
            <td>
                <span className="text-xs">
                    {typeof contest.prizeMoney === "number"
                        ? `$${contest.prizeMoney.toFixed(2)}`
                        : "N/A"}
                </span>
            </td>

            {/* Participants */}
            <td className="hidden md:table-cell">
                <span className="text-xs">{contest.participationCount ?? 0}</span>
            </td>

            {/* Status */}
            <td>
                <span
                    className={`badge badge-xs md:badge-sm capitalize ${statusClass}`}
                >
                    {statusLabel}
                </span>
            </td>

            {/* Actions */}
            <td>
                <div className="flex flex-wrap justify-center gap-1">
                    {onConfirm && (
                        <button
                            className="btn btn-xs btn-success text-xs text-white"
                            disabled={status === "approved"}
                            onClick={onConfirm}
                        >
                            Confirm
                        </button>
                    )}

                    {onReject && (
                        <button
                            className="btn btn-xs btn-warning text-xs"
                            disabled={status === "rejected"}
                            onClick={onReject}
                        >
                            Reject
                        </button>
                    )}

                    {onDelete && (
                        <button
                            className="btn btn-xs btn-error text-xs text-white"
                            onClick={onDelete}
                        >
                            Delete
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default ContestRow;