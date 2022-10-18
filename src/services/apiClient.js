import axios from "axios";

const baseURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5005";

const apiClient = axios.create({baseURL})

apiClient.interceptors.request.use((config)=>{
    const token = localStorage.getItem("authToken");

    if (token){
        config.headers = {...config.headers, Authorization: `Bearer ${token}`}
        console.log("Token --> ", token)
    }
    
    return config;
})

export default apiClient;