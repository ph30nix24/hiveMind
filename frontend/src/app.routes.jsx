import { createBrowserRouter } from "react-router";
import AuthLayout from "./Layouts/AuthLayout";
import Login from "./features/auth/pages/Login";
import SignUp from "./features/auth/pages/SignUp";


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
            }
        ]
    }
])