import axios from 'axios';
import { BASE_URL } from './apiPath';
imprt {BASE_URL} from './apiPath';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "content-type": "application/json",
        Accept: "application/json",

    },
});

//request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
            if (accessToken) {
                config.headers["Authorization"] = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => {
            if(error.response){
                if{error.response.status === 401}{

                    //redict to login page

                    window.location.href = "/login";
                }else if(error.response.status === 500){
                    console.error("Server error - try again later");
                }else if(error.code === "ECONNABORTED"){
                    console.error("A timeout has occurred");
                }
                return Promise.reject(error);
            }
            export default axiosInstance;
