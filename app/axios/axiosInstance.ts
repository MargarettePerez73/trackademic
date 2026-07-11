import axios from 'axios';

const axiosInstance = axios.create({

    baseURL: "http://10.82.208.25/api",
    headers: {
        contentType: 'application/json',
    },
});

export default axiosInstance;