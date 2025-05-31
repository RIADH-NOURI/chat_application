import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const baseUrl = axios.create({
  baseURL: 'http://192.168.1.39:5000/api',
  withCredentials: true,
});


 export const queryClient = new QueryClient();



