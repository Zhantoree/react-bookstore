import axios from 'axios';

const axiosClient = axios.create({
    baseURL: '/',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
});

export default axiosClient;
