
import axios from 'axios';

const axiosInterceptorInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_LARAVEL_API_URL,
});

axiosInterceptorInstance.interceptors.request.use(
  (config) => {
        const accessToken = localStorage.getItem("token");
    if (accessToken) {
      if (config.headers) config.headers.Authorization =  accessToken ? `Bearer ${accessToken}` : '';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInterceptorInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInterceptorInstance;