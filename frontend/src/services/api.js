import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (userData) => api.post('/auth/register', userData),
    me: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout'),
};

export const memoryAPI = {
    getAll: () => api.get('/memory'),
    getUserMemories: () => api.get('/memory/user'),
    getById: (id) => api.get(`/memory/${id}`),
    create: (memoryData) => api.post('/memory', memoryData),
    update: (id, memoryData) => api.put(`/memory/${id}`, memoryData),
    delete: (id) => api.delete(`/memory/${id}`),
};

export const reminderAPI = {
    getAll: () => api.get('/reminder'),
    getUserReminders: () => api.get('/reminder/user'),
    getUpcoming: (days = 7) => api.get(`/reminder/upcoming?days=${days}`),
    getByMemoryId: (memoryId) => api.get(`/reminder/memory/${memoryId}`),
    getById: (id) => api.get(`/reminder/${id}`),
    create: (reminderData) => api.post('/reminder', reminderData),
    update: (id, reminderData) => api.put(`/reminder/${id}`, reminderData),
    markComplete: (id) => api.patch(`/reminder/${id}/complete`),
    delete: (id) => api.delete(`/reminder/${id}`),
};

export const collaborationAPI = {
    getAll: () => api.get('/collaboration'),
    getUserCollaborations: () => api.get('/collaboration/user'),
    getById: (id) => api.get(`/collaboration/${id}`),
    getMembers: (id) => api.get(`/collaboration/${id}/members`),
    getMemories: (id) => api.get(`/collaboration/${id}/memories`),
    create: (collaborationData) => api.post('/collaboration', collaborationData),
    update: (id, collaborationData) => api.put(`/collaboration/${id}`, collaborationData),
    delete: (id) => api.delete(`/collaboration/${id}`),
    addMember: (id, userId, role) => api.post(`/collaboration/${id}/members`, { user_id: userId, role }),
    removeMember: (id, userId) => api.delete(`/collaboration/${id}/members/${userId}`),
    addMemory: (id, memoryId) => api.post(`/collaboration/${id}/memories`, { memory_id: memoryId }),
    removeMemory: (id, memoryId) => api.delete(`/collaboration/${id}/memories/${memoryId}`),
};

export const imageAPI = {
    getByMemoryId: (memoryId) => api.get(`/images/memory/${memoryId}`),
    upload: (formData) => {
        return api.post('/images', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    uploadBase64: (imageData, memoryId, filename) => {
        return api.post('/images/base64', {
            image_data: imageData,
            memory_id: memoryId,
            filename
        });
    },
    delete: (id) => api.delete(`/images/${id}`),
};

export const ttsAPI = {
    generate: (text, memoryId, userId) => api.post('/tts', { text, memory_id: memoryId, user_id: userId }),
    getByMemoryId: (memoryId) => api.get(`/tts/${memoryId}`),
};

export const storytellerAPI = {
    getAll: () => api.get('/storyteller'),
    getUserStorytellers: (userId) => api.get(`/storyteller/user/${userId}`),
    getById: (id) => api.get(`/storyteller/${id}`),
    create: (storytellerData) => api.post('/storyteller', storytellerData),
    update: (id, storytellerData) => api.put(`/storyteller/${id}`, storytellerData),
    delete: (id) => api.delete(`/storyteller/${id}`),
};

export const storytellerMemoryAPI = {
    getMemoriesByStoryteller: (storytellerId) => api.get(`/storyteller-memory/storyteller/${storytellerId}`),
    getStorytellersByMemory: (memoryId) => api.get(`/storyteller-memory/memory/${memoryId}`),
    associate: (storytellerId, memoryId) => api.post('/storyteller-memory', { storyteller_id: storytellerId, memory_id: memoryId }),
    disassociate: (storytellerId, memoryId) => api.delete(`/storyteller-memory/${storytellerId}/${memoryId}`),
    getDetails: (storytellerId, memoryId) => api.get(`/storyteller-memory/${storytellerId}/${memoryId}`),
};

export default api;
