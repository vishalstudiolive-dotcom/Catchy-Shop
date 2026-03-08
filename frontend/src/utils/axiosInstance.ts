import axios from 'axios';
import { store } from '../store/store';
import { login, logout, setToken } from '../store/authSlice';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Send cookies with requests
});

// Request interceptor to attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 & refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh-token') {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(`${axiosInstance.defaults.baseURL}/auth/refresh-token`, {}, {
          withCredentials: true
        });

        // Save new token in store
        store.dispatch(setToken(data.token));
        
        if (data.user) {
          store.dispatch(login({ user: data.user, token: data.token }));
        }

        // Retry the original request
        originalRequest.headers['Authorization'] = `Bearer ${data.token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout()); // If refresh fails, log out
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
