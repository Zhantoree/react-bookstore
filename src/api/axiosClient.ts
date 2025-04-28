import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080', // change as needed for your backend API
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
});

export default axiosClient;
