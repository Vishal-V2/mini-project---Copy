import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Prison API calls
export const getPrisons = () => api.get('/prisons');
export const getPrison = (id) => api.get(`/prisons/${id}`);
export const createPrison = (data) => api.post('/prisons', data);
export const updatePrison = (id, data) => api.put(`/prisons/${id}`, data);
export const deletePrison = (id) => api.delete(`/prisons/${id}`);

// Prisoner API calls
export const getPrisoners = () => api.get('/prisoners');
export const getPrisoner = (id) => api.get(`/prisoners/${id}`);
export const createPrisoner = (data) => api.post('/prisoners', data);
export const updatePrisoner = (id, data) => api.put(`/prisoners/${id}`, data);
export const deletePrisoner = (id) => api.delete(`/prisoners/${id}`);
export const getPrisonersByPrison = (prisonId) => api.get(`/prisoners/prison/${prisonId}`);

// Staff API calls
export const getStaff = () => api.get('/staff');
export const getStaffMember = (id) => api.get(`/staff/${id}`);
export const createStaffMember = (data) => api.post('/staff', data);
export const updateStaffMember = (id, data) => api.put(`/staff/${id}`, data);
export const deleteStaffMember = (id) => api.delete(`/staff/${id}`);

// Visitor API calls
export const getVisitors = () => api.get('/visitors');
export const getVisitor = (id) => api.get(`/visitors/${id}`);
export const createVisitor = (data) => api.post('/visitors', data);
export const updateVisitor = (id, data) => api.put(`/visitors/${id}`, data);
export const deleteVisitor = (id) => api.delete(`/visitors/${id}`);

// Punishment API calls
export const getPunishments = () => api.get('/punishments');
export const getPunishment = (id) => api.get(`/punishments/${id}`);
export const createPunishment = (data) => api.post('/punishments', data);
export const updatePunishment = (id, data) => api.put(`/punishments/${id}`, data);
export const deletePunishment = (id) => api.delete(`/punishments/${id}`);

// Error interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response);
        return Promise.reject(error);
    }
);

export default api;
