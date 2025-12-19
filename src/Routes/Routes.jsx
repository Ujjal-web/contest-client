import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import DashboardLayout from "../Layout/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";


// User dashboard pages

import UserProfile from "../pages/Dashboard/User/UserProfile";
import MyParticipatedContests from "../pages/Dashboard/User/MyParticipatedContest";
import MyWinningContest from "../pages/Dashboard/User/MyWinningContest";

// Creator dashboard pages 
import AddContest from "../pages/Dashboard/Creator/AddContest";
import MyContests from "../pages/Dashboard/Creator/MyContests";
import CreatorSubmissions from "../pages/Dashboard/Creator/CreatorSubmissions";
import EditContest from "../pages/Dashboard/Creator/EditContest";

// Admin dashboard pages
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import ManageContests from "../pages/Dashboard/Admin/ManageContests";
import ErrorPage from "../pages/ErrorPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import AllContests from "../pages/AllContests/AllContests";





const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
        errorElement: <ErrorPage />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/all-contests", element: <AllContests /> },
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
            // TODO: add AllContests, Leaderboard, About, HowItWorks, etc.
        ],
    },
    {
        path: "/dashboard",
        element: (
            <PrivateRoute>
                <DashboardLayout />
            </PrivateRoute>
        ),
        children: [
            // User dashboard
            { path: "/dashboard", element: <Dashboard /> },
            { path: "user/participated", element: <MyParticipatedContests /> },
            { path: "user/wins", element: <MyWinningContest /> },
            { path: "user/profile", element: <UserProfile /> },

            // Creator dashboard
            { path: "creator/add-contest", element: <AddContest /> },
            { path: "creator/my-contests", element: <MyContests /> },
            { path: "creator/submissions/:contestId", element: <CreatorSubmissions /> },
            { path: "creator/edit/:contestId", element: <EditContest /> },

            // Admin dashboard
            { path: "admin/manage-users", element: <ManageUsers /> },
            { path: "admin/manage-contests", element: <ManageContests /> },
        ],
    },
]);

export default router;