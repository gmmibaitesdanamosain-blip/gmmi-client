import api from '../utils/axios';

export const getAllPewartaan = async () => {
    const response = await api.get('/api/pewartaan');
    return response.data;
};

export const getPewartaanById = async (id: number) => {
    const response = await api.get(`/api/pewartaan/${id}`);
    return response.data;
};

export const createPewartaan = async (data: any) => {
    const response = await api.post('/api/pewartaan', data);
    return response.data;
};

export const updatePewartaan = async (id: number, data: any) => {
    const response = await api.put(`/api/pewartaan/${id}`, data);
    return response.data;
};

export const deletePewartaan = async (id: number) => {
    const response = await api.delete(`/api/pewartaan/${id}`);
    return response.data;
};

export const exportPewartaanExcel = async (id: number, judul: string) => {
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

export const exportPewartaanWord = async (id: number, judul: string) => {
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
