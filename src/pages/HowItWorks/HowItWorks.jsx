const HowItWorks = () => {
    return (
        <section className="space-y-8">
            {/* Intro */}
            <div className="rounded-3xl bg-base-100 border border-base-300 p-6 md:p-8 shadow-sm">
                <h1 className="text-2xl md:text-3xl font-bold text-base-content mb-2">
                    How ContestHub works
                </h1>
                <p className="text-sm md:text-base text-base-content/70 max-w-3xl">
                    ContestHub connects three types of users in one place: participants,
                    contest creators, and admins. Every contest follows a simple, transparent
                    flow from idea to winner announcement.
                </p>
            </div>

            {/* Step-by-step timeline */}
            <div className="rounded-3xl bg-base-100 border border-base-300 p-6 space-y-5">
                <h2 className="text-lg md:text-xl font-semibold text-base-content">
                    From contest idea to winner in 6 steps
                </h2>
                <ol className="relative border-s border-base-300 ps-4 space-y-5 text-sm text-base-content/80">
                    <li>
                        <StepBullet number={1} />
                        <p className="font-semibold text-base-content">
                            Creator submits a new contest
                        </p>
                        <p className="text-xs text-base-content/70">
                            Using the creator dashboard, a contest creator fills out the Add
                            Contest form with a name, image, description, entry fee, prize
                            money, contest type, and deadline. New contests start with
                            <span className="font-semibold"> pending</span> status.
                        </p>
                    </li>

                    <li>
                        <StepBullet number={2} />
                        <p className="font-semibold text-base-content">
                            Admin reviews and approves the contest
                        </p>
                        <p className="text-xs text-base-content/70">
                            Admins see all new contests in the Manage Contests table. They can
                            confirm, reject, or delete contests. Approved contests appear on the
                            Home page and the All Contests page for everyone to discover.
                        </p>
                    </li>

                    <li>
                        <StepBullet number={3} />
                        <p className="font-semibold text-base-content">
                            Participants browse and register
                        </p>
                        <p className="text-xs text-base-content/70">
                            Logged-in users explore contests by category and search. When they
                            decide to join, they click the{" "}
                            <span className="font-semibold">Register / Pay</span> button on the
                            contest details page and complete a secure payment using Stripe
                            (test mode). After payment they are officially registered.
                        </p>
                    </li>

                    <li>
                        <StepBullet number={4} />
                        <p className="font-semibold text-base-content">
                            Participants submit their tasks
                        </p>
                        <p className="text-xs text-base-content/70">
                            Registered users see an active{" "}
                            <span className="font-semibold">Submit task</span> button. They
                            open a modal, paste links or descriptions of their work, and send
                            the submission. Submissions are stored and shown to the creator in
                            the Submitted Tasks page.
                        </p>
                    </li>

                    <li>
                        <StepBullet number={5} />
                        <p className="font-semibold text-base-content">
                            Creator reviews submissions and declares a winner
                        </p>
                        <p className="text-xs text-base-content/70">
                            After the contest deadline passes, the creator opens their
                            <span className="font-semibold"> Contest submissions</span> view,
                            reads each entry, and chooses a single winner. Declaring a winner
                            marks one submission as{" "}
                            <span className="font-semibold">Winner</span> and updates the
                            contest with winner information.
                        </p>
                    </li>

                    <li>
                        <StepBullet number={6} />
                        <p className="font-semibold text-base-content">
                            Winner appears on the leaderboard and profile
                        </p>
                        <p className="text-xs text-base-content/70">
                            Once a winner is declared, the participant’s win count increases.
                            The contest shows the winner’s name and photo, and the global
                            <span className="font-semibold"> Leaderboard</span> ranks users by
                            total wins. The win also contributes to their profile statistics.
                        </p>
                    </li>
                </ol>
            </div>

            {/* Role-based responsibilities */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-base-100 border border-base-300 p-4 space-y-2">
                    <h2 className="text-sm font-semibold text-base-content">
                        Participant workflow
                    </h2>
                    <ul className="list-disc list-inside text-xs text-base-content/70 space-y-1">
                        <li>Create an account or log in with Google.</li>
                        <li>Browse approved contests by type and search.</li>
                        <li>Pay the entry fee to register.</li>
                        <li>Submit your task before the deadline.</li>
                        <li>Watch results and track your wins on the leaderboard.</li>
                    </ul>
                </div>

                <div className="rounded-2xl bg-base-100 border border-base-300 p-4 space-y-2">
                    <h2 className="text-sm font-semibold text-base-content">
                        Creator workflow
                    </h2>
                    <ul className="list-disc list-inside text-xs text-base-content/70 space-y-1">
                        <li>Request or receive creator role from an admin.</li>
                        <li>Create contests from the creator dashboard.</li>
                        <li>Edit or delete contests while they are still pending.</li>
                        <li>Review all submitted tasks for your contests.</li>
                        <li>Declare one winner after the deadline has passed.</li>
                    </ul>
                </div>

                <div className="rounded-2xl bg-base-100 border border-base-300 p-4 space-y-2">
                    <h2 className="text-sm font-semibold text-base-content">
                        Admin workflow
                    </h2>
                    <ul className="list-disc list-inside text-xs text-base-content/70 space-y-1">
                        <li>Review and approve or reject new contests.</li>
                        <li>Change user roles between User, Creator, and Admin.</li>
                        <li>Delete contests that break rules or look unsafe.</li>
                        <li>Monitor platform activity and maintain fairness.</li>
                    </ul>
                </div>
            </div>

            {/* FAQ-style section */}
            <div className="rounded-3xl bg-base-100 border border-base-300 p-6 space-y-3">
                <h2 className="text-lg md:text-xl font-semibold text-base-content">
                    Common questions
                </h2>
                <div className="space-y-2 text-sm text-base-content/80">
                    <div>
                        <p className="font-semibold text-base-content">
                            How are payments handled?
                        </p>
                        <p className="text-xs text-base-content/70">
                            Payments are processed with Stripe in test mode for this project.
                            Every successful payment creates a record in the database and
                            increases the contest&apos;s participant count automatically.
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold text-base-content">
                            Can a contest have more than one winner?
                        </p>
                        <p className="text-xs text-base-content/70">
                            No. Each contest is limited to a single winner. Once a winner is
                            declared, the winner button is disabled for all other submissions.
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold text-base-content">
                            What happens after I win?
                        </p>
                        <p className="text-xs text-base-content/70">
                            The contest details page highlights you as the winner, your
                            profile reflects the win, and your rank on the leaderboard
                            improves based on your total number of wins.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;

/* ---------- Small bullet component for steps ---------- */
const StepBullet = ({ number }) => (
    <span className="absolute -start-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-content text-xs font-semibold">
        {number}
    </span>
);