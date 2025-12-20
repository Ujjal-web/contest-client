import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { logOut } = useAuth() || {};

    useEffect(() => {
        // REQUEST interceptor: attach JWT token
        const requestInterceptor = axiosSecure.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem("access-token");
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // RESPONSE interceptor: handle 401 / 403
        const responseInterceptor = axiosSecure.interceptors.response.use(
            (response) => response,
            async (error) => {
                const status = error?.response?.status;

                if ((status === 401 || status === 403) && logOut) {
                    try {
                        await logOut();
                    } catch (e) {
                        console.error("Error during logout:", e);
                    }
                    navigate("/login");
                }

                return Promise.reject(error);
            }
        );

        // Cleanup on unmount
        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [logOut, navigate]);

    return axiosSecure;
};

export default useAxiosSecure;