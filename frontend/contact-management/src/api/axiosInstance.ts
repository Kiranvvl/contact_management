import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
  timeout: 10000,
});

/* =======================
   REQUEST INTERCEPTOR
======================= */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =======================
   RESPONSE INTERCEPTOR
======================= */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API Error:",
      error.response?.data || error.message
    );

    if (
      error.response?.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      localStorage.clear();
      window.location.replace("/login");
    }

    if (error.code === "ECONNABORTED") {
      console.error("⏱️ Request timeout");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
