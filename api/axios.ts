import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
    "http://localhost:5000",
  withCredentials: true,
});

export default api;
