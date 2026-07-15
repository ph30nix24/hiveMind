import { createBrowserRouter } from "react-router";
import AuthLayout from "./Layouts/AuthLayout";
import Login from "./features/auth/pages/Login";
import SignUp from "./features/auth/pages/SignUp";
import Verify from "./features/auth/pages/Verify";


export const router = createBrowserRouter([
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "signup",
                element: <SignUp />,
            },
            {
                path: "verify-email",
                element: <Verify />
            }
        ]
    }
])