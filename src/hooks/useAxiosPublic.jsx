import axios from "axios";

const axiosPublic = axios.create({
    baseURL: 'http://localhost:5000' //Backend URL
});

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;