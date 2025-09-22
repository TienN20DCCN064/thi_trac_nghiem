import axios from "axios";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com", // fake API test
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
