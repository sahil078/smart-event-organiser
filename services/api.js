import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Use correct local dev host per platform
const LOCAL_API_HOST =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3001' // Android emulator loopback to host
    : 'http://localhost:3001'; // iOS simulator / web

// Allow override via env (expo start --clear; set EXPO_PUBLIC_API_URL)
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL
  ? `${process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, '')}/api`
  : `${LOCAL_API_HOST}/api`;

console.log('[API] Base URL (public):', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

// No auth interceptors now (public API)

export const eventsAPI = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  create: (eventData) => api.post('/events', eventData),
  update: (id, eventData) => api.put(`/events/${id}`, eventData),
  addCollaborator: (eventId, email) =>
    api.post(`/events/${eventId}/collaborators`, { email }),
};

export const aiAPI = {
  generateDescription: (data) => api.post('/ai/generate-description', data),
  enhanceDescription: (data) => api.post('/ai/enhance-description', data),
};

export { api };