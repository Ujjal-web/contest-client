import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ContestCard = ({ contest }) => {
    const { user } = useAuth() || {};
    const navigate = useNavigate();
    const location = useLocation();

    const {
        _id,
        name,
        title,
        image,
        description,
        participantsCount,
        participationCount,
        type,
        prizeMoney,
        price,
    } = contest || {};

    const displayName = name || title || "Contest";
    const participants = participantsCount ?? participationCount ?? 0;

    const handleDetails = () => {
        if (!user) {
            // Not logged in → go to login and then back here
            navigate("/login", { state: { from: location } });
        } else {
            navigate(`/contests/${_id}`);
        }
    };

    return (
        <div className="card bg-base-100 shadow-sm border border-base-300 hover:shadow-md transition duration-200 rounded-2xl overflow-hidden flex flex-col">
            {image && (
                <figure className="h-40 overflow-hidden">
                    <img
                        src={image}
                        alt={displayName}
                        className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                </figure>
            )}
            <div className="card-body flex-1 space-y-3">
                <div className="flex items-center justify-between gap-2">
                    <span className="badge badge-outline badge-sm capitalize">
                        {type || "Open"}
                    </span>
                    {typeof prizeMoney === "number" && (
                        <span className="badge badge-primary badge-sm">
                            Prize ${prizeMoney}
                        </span>
                    )}
                </div>

                <h3 className="card-title text-base md:text-lg">{displayName}</h3>

                {description && (
                    <p className="text-xs md:text-sm text-base-content/70">
                        {description.length > 110
                            ? `${description.slice(0, 110)}…`
                            : description}
                    </p>
                )}

                <div className="flex items-center justify-between text-xs text-base-content/70 pt-2">
                    <span>
                        Participants: <span className="font-semibold">{participants}</span>
                    </span>
                    {typeof price === "number" && (
                        <span>Entry fee: ${price.toFixed(2)}</span>
                    )}
                </div>

                <div className="card-actions justify-end pt-2">
                    <button
                        onClick={handleDetails}
                        className="btn btn-sm btn-primary normal-case"
                    >
                        View details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContestCard;