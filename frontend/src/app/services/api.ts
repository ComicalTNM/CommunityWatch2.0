// frontend/src/app/services/api.ts

import axios from 'axios';
import { IOrganizationProfile } from "@shared/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  if (config.method !== 'get') {
    try {
      const { data } = await axios.get(`${API_URL}/auth/csrf-token`, { withCredentials: true });
      config.headers['x-csrf-token'] = data.csrfToken;
    } catch (error) {
      console.error('Failed to fetch CSRF token', error);
    }
  }
  return config;
});


export const fetchOrganizationPublicProfile = async (id: string): Promise<IOrganizationProfile> => {
  const response = await api.get(`/profiles/public/${id}`);
  return response.data;
};


export default api;