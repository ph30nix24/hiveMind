
import { Outlet } from 'react-router'

const AuthLayout = () => {
    return (
        <main className="min-h-screen">
            <Outlet />
        </main >
    )
}

export default AuthLayout