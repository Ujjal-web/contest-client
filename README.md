# ContestForge

ContestForge is a modern contest management platform where creators host creative competitions and users join, submit their best work, and celebrate wins.

## Live Links

- Client: 
- Server: 

## Features

- Fully responsive UI for mobile, tablet, and desktop (including dashboards).
- Role-based access with three roles: Admin, Contest Creator, and Normal User.
- Secure authentication with Firebase (Email/Password + Google) and JWT-protected APIs.
- Users can browse all approved contests, filter by category, and search by contest type.
- Contest registration with a payment flow; participant count updates after successful payment.
- Private contest details page with live deadline countdown and task submission modal.
- Creator dashboard to add contests, edit/delete pending ones, view submissions, and declare winners.
- Admin dashboard to manage users, change roles, and approve/reject/delete contests.
- Personalized user dashboard showing participated contests, winnings, and a win-percentage chart.
- Dynamic leaderboard page ranking users by the number of contests they have won.
- Dark/Light theme toggle with persisted preference via localStorage.
- Toast/SweetAlert notifications for login, registration, payments, and all CRUD actions.
- All forms use react-hook-form and all data fetching is powered by TanStack Query.
- 404 Not Found page with a friendly message and a button to go back home.

## Tech Stack

- **Frontend:** React, React Router, Tailwind CSS, DaisyUI, TanStack Query, React Hook Form, Firebase Auth, Axios, SweetAlert2
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT
- **Others:** Stripe (test mode) for payments, Framer Motion/AOS for animations