import axios from 'axios'; import { APP_SETTINGS } from '../../../config';
const client = axios.create({ baseURL: APP_SETTINGS.API_BASE, timeout: 15000 });
client.interceptors.request.use((config) => { try { const user = JSON.parse(localStorage.getItem('agri_session') || 'null'); if (user?.token) config.headers.Authorization = `Bearer ${user.token}`; } catch { localStorage.removeItem('agri_session'); } return config; });
client.interceptors.response.use((response) => response, (error) => { error.message = error.response?.data?.message || error.message; if (error.response?.status === 401 && !/\/users\/(login|register)$/.test(error.config?.url || '')) { localStorage.removeItem('agri_session'); if (window.location.pathname !== '/login') window.location.assign('/login'); } return Promise.reject(error); });
export const responseError = (error) => error.response?.data?.message || error.message || 'Request failed';
export const withMessage = (error) => { error.message = responseError(error); throw error; };
export default client;
