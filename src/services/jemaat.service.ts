import api from '../utils/axios';

export const getAllJemaat = async (filters: any = {}) => {
    try {
        const params = new URLSearchParams(filters).toString();
        const response = await api.get(`/api/jemaat?${params}`);
        return response.data;
    } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : 'Gagal mengambil data jemaat');
    }
};

export const createJemaat = async (data: any) => {
    try {
        const response = await api.post('/api/jemaat', data);
        return response.data;
    } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : 'Gagal menambahkan data jemaat');
    }
};

export const updateJemaat = async (id: string, data: any) => {
    try {
        const response = await api.put(`/api/jemaat/${id}`, data);
        return response.data;
    } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : 'Gagal memperbarui data jemaat');
    }
};

export const deleteJemaat = async (id: string) => {
    try {
        const response = await api.delete(`/api/jemaat/${id}`);
        return response.data;
    } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : 'Gagal menghapus data jemaat');
    }
};

export const getSectors = async () => {
    try {
        const response = await api.get('/api/jemaat/sectors');
        return response.data;
    } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : 'Gagal mengambil data sektor');
    }
};

export const createSector = async (data: any) => {
    try {
        const response = await api.post('/api/jemaat/sectors', data);
        return response.data;
    } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : 'Gagal menambahkan sektor baru');
    }
};

export const updateSector = async (id: string, data: any) => {
    try {
        const response = await api.put(`/api/jemaat/sectors/${id}`, data);
        return response.data;
    } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : 'Gagal memperbarui data sektor');
    }
};

export const deleteSector = async (id: string) => {
    try {
        const response = await api.delete(`/api/jemaat/sectors/${id}`);
        return response.data;
    } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : 'Gagal menghapus data sektor');
    }
};
