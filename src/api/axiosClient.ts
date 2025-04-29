import axios from 'axios';

const axiosClient = axios.create({
    baseURL: '138.68.103.232:80',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
});

export default axiosClient;
