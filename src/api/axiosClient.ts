import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://159.65.113.164',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://159.65.113.164:80'
    }
});

export default axiosClient;
