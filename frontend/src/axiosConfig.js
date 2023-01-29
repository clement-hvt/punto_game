import axios from 'axios';
// Next we make an 'instance' of it
const instance = axios.create({
    baseURL: 'https://localhost:3000'
});

instance.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE';
export default instance;