import axios from 'axios';

export const http = axios.create({
  // eslint-disable-next-line no-undef
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 1000,
});
