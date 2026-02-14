import api from '../utils/axios';

export const getAllJemaat = async (filters: any = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/api/jemaat?${params}`);
    return response.data;
};

export const createJemaat = async (data: any) => {
    const response = await api.post('/api/jemaat', data);
    return response.data;
};

export const updateJemaat = async (id: string, data: any) => {
    const response = await api.put(`/api/jemaat/${id}`, data);
    return response.data;
};

export const deleteJemaat = async (id: string) => {
    const response = await api.delete(`/api/jemaat/${id}`);
    return response.data;
};

export const getSectors = async () => {
    const response = await api.get('/api/jemaat/sectors');
    return response.data;
};

export const createSector = async (data: any) => {
    const response = await api.post('/api/jemaat/sectors', data);
    return response.data;
};

export const updateSector = async (id: string, data: any) => {
    const response = await api.put(`/api/jemaat/sectors/${id}`, data);
    return response.data;
};

export const deleteSector = async (id: string) => {
    const response = await api.delete(`/api/jemaat/sectors/${id}`);
    return response.data;
};
