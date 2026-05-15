import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://api.vyshnavpc.local:3000/api";
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    if (error.response) {
      if (error.response.status === 401) {
        console.warn("Unauthorized - Redirecting to SSO");
        window.location.href = `${import.meta.env.VITE_SSO_URL}/auth/validate?redirect=${encodeURIComponent(window.location.origin)}`;
        return null;
      }
    }
    return Promise.reject(error);
  },
);

export default api;
