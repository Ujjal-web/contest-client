import axios from "axios";

const axiosPublic = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://contest-server-11.vercel.app' //Backend URL
});


const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;