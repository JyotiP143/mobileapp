// Correct way to import type
import axios from "axios";

const api = axios.create({
  baseURL: "https://finance.evoxcel.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 5000, // Optional
});

export default api;
