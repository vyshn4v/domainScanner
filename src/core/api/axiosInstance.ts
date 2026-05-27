import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://api.vyshnavpc.local:3000";
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
const excludedApiPaths = ["/auth/validate"];

api.interceptors.request.use((config) => {
  const userStr = sessionStorage.getItem("user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user?.email) {
        config.headers["useremail"] = user.email;
      }
      if (user?.id) {
        config.headers["userid"] = user.id.toString();
      }
    } catch (error) {
      console.error("Failed to parse user from sessionStorage", error);
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    
    if (error.response) {
      if (error.response.status === 401) {
        const url = error.config?.url || "";
        const isExcluded = excludedApiPaths.some(path => url.includes(path));
        
        if (!isExcluded) {
          console.warn("Unauthorized - Redirecting to SSO");
          window.location.href = `${import.meta.env.VITE_SSO_URL}/auth/validate?redirect=${encodeURIComponent(window.location.origin)}`;
          // Return a pending promise so we don't trigger subsequent .catch blocks while redirecting
          return new Promise(() => {});
        }
      } else if (error.response.status === 403) {
        console.warn("Forbidden - Clearing session and refreshing page");
        sessionStorage.removeItem("user");
        window.location.reload();
        return new Promise(() => {});
      }
    }
    return Promise.reject(error);
  },
);

export default api;
