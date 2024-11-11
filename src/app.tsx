import axios from "axios";

const api = axios.create({
  baseURL: "http://172.30.153.75:3335/",
  headers: {"x-app-origin":"conectaif-mobile-app"}
});

export default api;
