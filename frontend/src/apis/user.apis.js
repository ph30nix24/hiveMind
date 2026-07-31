import axios from 'axios'

const USER_URL = `${import.meta.env.VITE_BACKEND_URI}/hivemind/user/`;


export const getCurrentUserApi = async () => {
    try {
        const res = await axios.get(`${USER_URL}/get-me`, { withCredentials: true })
        return res.data
    }
    catch (error) {
        console.error("Google login failed:", error.response?.data || error.message);
        throw error;
    }
}