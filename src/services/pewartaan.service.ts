import api from '../utils/axios';

export const getAllPewartaan = async () => {
    try {
        const response = await api.get('/api/pewartaan');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal mengambil data pewartaan');
    }
};

export const getPewartaanById = async (id: string) => {
    try {
        const response = await api.get(`/api/pewartaan/${id}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Data pewartaan tidak ditemukan');
    }
};

export const createPewartaan = async (data: any) => {
    try {
        const response = await api.post('/api/pewartaan', data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal membuat pewartaan baru');
    }
};

export const updatePewartaan = async (id: string, data: any) => {
    try {
        const response = await api.put(`/api/pewartaan/${id}`, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal memperbarui data pewartaan');
    }
};

export const deletePewartaan = async (id: string) => {
    try {
        const response = await api.delete(`/api/pewartaan/${id}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal menghapus data pewartaan');
    }
};

export const exportPewartaanExcel = async (id: string, judul: string) => {
    const response = await api.get(`/api/pewartaan/${id}/export/excel`, {
        responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Warta_${judul.replace(/\s+/g, '_')}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
};

export const exportPewartaanWord = async (id: string, judul: string) => {
    const response = await api.get(`/api/pewartaan/${id}/export/word`, {
        responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Warta_${judul.replace(/\s+/g, '_')}.docx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
};
