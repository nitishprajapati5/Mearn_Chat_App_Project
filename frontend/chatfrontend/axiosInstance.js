import axios from "axios";

const axiosInstance = axios.create({
    baseURL:'http://localhost:300',
    withCredentials:true
})

export default axiosInstance