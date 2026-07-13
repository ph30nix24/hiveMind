import axios from 'axios'

const AUTH_URL = `${import.meta.env.BACKEND_URI}/auth`;

export const googleLoginApi = async ({ token }) => {
    try {
        const res = await axios.post(`${AUTH_URL}/google`, { token}, {
            withCredentials: true
        })
        console.log(res.data.message);
        return res.data
    } catch (error) {
    console.error("Google login failed:", error.response?.data || error.message);
  }
}