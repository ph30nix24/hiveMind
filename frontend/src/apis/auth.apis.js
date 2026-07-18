import axios from 'axios'

const AUTH_URL = `${import.meta.env.VITE_BACKEND_URI}/hivemind/auth`;

export const googleLoginApi = async ({ token }) => {
    try {
        const res = await axios.post(`${AUTH_URL}/google`, { token }, {
            withCredentials: true
        })
        return res.data
    } catch (error) {
        console.error("Google login failed:", error.response?.data || error.message);
        throw error;
    }
}



export const signUpApi = async ({ name, email, password }) => {
    try {
        const res = await axios.post(`${AUTH_URL}/sign-up`, { name, email, password }, {
            withCredentials: true
        })
        console.log(res.data)
        return res.data
    } catch (error) {
        console.error("SignUp failed:", error.response?.data || error.message);
        throw error;
    }
}


export const loginApi = async ({ email, password }) => {
    try {
        const res = await axios.post(`${AUTH_URL}/login`, { email, password }, {
            withCredentials: true
        })
        return res.data
    } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        throw error;
    }
}


export const emailVerifyApi = async ({ otp }) => {
    try {
        const res = await axios.post(`${AUTH_URL}/email-verify`, { otp }, {
            withCredentials: true
        })
        console.log(res.data.message)

    } catch (error) {
        console.error("email verification failed:", error.response?.data || error.message);
    }
}
