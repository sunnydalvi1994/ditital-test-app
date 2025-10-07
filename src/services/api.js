import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5174', // ✅ JSON Server port
  timeout: 10000
});

export default api;
