// src/lib/api.ts
import axios from 'axios';



const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});


// const api = axios.create({
//   baseURL: 'https://z5gh16bc-8000.asse.devtunnels.ms/api/',
// });

export default api;


// https://z5gh16bc-5173.asse.devtunnels.ms/
// https://z5gh16bc-8000.asse.devtunnels.ms/