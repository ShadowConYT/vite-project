// src/api/axiosConfig.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000",
});

// Set the Authorization header if token exists in localStorage
const token = localStorage.getItem("access_token");
if (token) {
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default instance;
