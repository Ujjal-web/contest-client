# ContestHub Client

ContestHub is a modern contest management platform where admins, creators, and participants can run and join creative competitions.  
This repository contains the **frontend** (React + Vite) application.

---

## Live Demo

- **Live site**: https://contest-client-11.vercel.app  
- **Backend API**: https://contest-server-11.vercel.app  

### Test Accounts

- **Contact for test Accounts**
  - Email: ujjaldas827@gmail.com
  - WhatsApp: +8801749361101

---

## Tech Stack

- **Framework:** React (Vite)
- **Routing:** React Router
- **Styling:** Tailwind CSS, DaisyUI
- **Data Fetching:** TanStack Query (React Query)
- **Forms:** react-hook-form (used in every form)
- **Auth:** Firebase Authentication (email/password + Google)
- **API Communication:** Axios  
  - `useAxiosPublic` – public APIs  
  - `useAxiosSecure` – private APIs with JWT + interceptors
- **Payments:** Stripe.js & `@stripe/react-stripe-js` with Payment Element
- **Animations:** AOS (Animate On Scroll)
- **Charts:** Recharts (win-percentage chart on profile)

---

## Features

- **Role-based access (3 roles)**  
  - **Admin** – manage users and contests, approve/reject/delete contests.  
  - **Contest Creator** – add contests, edit/delete pending contests, review submissions, declare winners.  
  - **Normal User** – browse contests, register via payment, submit tasks, view wins.

- **Authentication & Authorization**
  - Firebase Authentication (email/password + Google sign-in).
  - JWT-based secure APIs – token stored in `localStorage` and attached via Axios interceptors.
  - Private routes remain logged in after refresh (using Firebase `onAuthStateChanged` + JWT).

- **Home Page**
  - Fully responsive layout for mobile, tablet, and desktop.
  - Animated hero banner with a **search bar** (search by contest type).
  - Popular contests section sorted by highest participation.
  - Winner spotlight section and extra static section to motivate users.
 

- **All Contests Page**
  - Shows all admin-approved contests with the same card design as popular contests.
  - Tabs for different contest types (Image Design, Article Writing, Business Idea, etc.).
  - Search bar with backend filtering.
  - **Pagination** (9 contests per page) powered by TanStack Query.

- **Contest Details (Private Route)**
  - Big banner image, full description, and task details.
  - Live deadline countdown; shows “Contest ended” after the deadline.
  - Participant count that increases after successful payment.
  - Prize money and winner info (name + photo) after creator declares a winner.
  - “Register / Pay” → Stripe Payment Element checkout.
  - “Submit task” modal with textarea – available only for registered users.

- **Stripe Payment Integration**
  - Uses Stripe Payment Element for a modern checkout experience.
  - Creates PaymentIntent via backend and confirms payments on the client.
  - After success, the user is registered and the contest participant count increases.

- **User Dashboard**
  - **My Participated Contests** – list of contests the user paid for, with payment status and sorted by upcoming deadline.
  - **My Winning Contests** – cards showing wins, contest names, and prize money.
  - **My Profile** – profile card and update form (name, photo URL, bio) plus a win-percentage chart for normal users.

- **Creator Dashboard**
  - Add Contest form with `react-hook-form` + `react-datepicker`.
  - My Created Contests table with status badges (Pending / Approved / Rejected).
  - Edit & Delete actions enabled only while status is Pending.
  - “See submissions” page to review all entries and declare a single winner.

- **Admin Dashboard**
  - Manage Users table with **pagination (10 per page)** and role change buttons (User ↔ Creator ↔ Admin).
  - Manage Contests table with Confirm / Reject / Delete actions for all contests.

- **Leaderboard**
  - Dynamic leaderboard page ranking users by number of wins.
  - Shows username, email, role, wins, and total prize money.

- **Extra Pages**
  - **About** – explains what ContestHub is and what problems it solves.
  - **How It Works** – step-by-step explanation of the whole contest lifecycle.

- **UI & UX**
  - Tailwind CSS + DaisyUI components.
  - **Dark/Light theme toggle** – user preference stored in `localStorage` and applied via DaisyUI.
  - **Animations** using AOS (Animate On Scroll) on hero, popular contests, all contests grid, and other sections.
  - SweetAlert2 toasts/popups for login, registration, payments, CRUD actions, and submissions.

---


## Project Structure (frontend)

```text
src/
  App.jsx
  main.jsx
  index.css
  Routes/
    Routes.jsx
  Layout/
    Main.jsx
    DashboardLayout.jsx
  components/
    Navbar.jsx
    contests/ContestCard.jsx
    dashboard/ContestRow.jsx
    home/HeroBanner.jsx
    home/PopularContestsSection.jsx
    home/WinnerSpotlightSection.jsx
    home/WhyContestHubSection.jsx
    payment/CheckoutForm.jsx
  hooks/
    useAuth.jsx
    useAxiosPublic.jsx
    useAxiosSecure.jsx
    useUserRole.jsx
  pages/
    Home/Home.jsx
    AllContests/AllContests.jsx
    ContestDetails/ContestDetails.jsx
    Payment/Payment.jsx
    Leaderboard/Leaderboard.jsx
    About/About.jsx
    HowItWorks/HowItWorks.jsx
    Login/Login.jsx
    Register/Register.jsx
    Dashboard/
      User/MyParticipatedContests.jsx
      User/MyWinningContest.jsx
      User/UserProfile.jsx
      Creator/AddContest.jsx
      Creator/MyContests.jsx
      Creator/CreatorSubmissions.jsx
      Creator/EditContest.jsx
      Admin/ManageUsers.jsx
      Admin/ManageContests.jsx
  providers/
    AuthProvider.jsx
  ErrorPage.jsx