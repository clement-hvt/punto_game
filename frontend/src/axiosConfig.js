import axios from 'axios';
// Next we make an 'instance' of it
const instance = axios.create({
    baseURL: 'http://localhost:3000'
});

instance.defaults.headers.common['Authorization'] = localStorage.getItem('token');
export default instance;