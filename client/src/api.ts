import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.BASE_URL,
    withCredentials: true,
});

// simple wrappers for the auth endpoints we already built
export const AuthAPI = {
    me: () => api.get('/auth/me').then(r => r.data),
    register: (email: string, password: string) =>
        api.post('/auth/register', { email, password }).then(r => r.data),
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }).then(r => r.data),
    logout: () => api.post('/auth/logout').then(r => r.data),
};


export default api;
