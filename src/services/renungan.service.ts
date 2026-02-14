
import apiService from '../utils/axios';

export const getAllRenungan = async () => {
    const response = await apiService.get('/api/renungan');
    return response.data;
};

export const getRenunganById = async (id: number) => {
    const response = await apiService.get(`/api/renungan/${id}`);
    return response.data;
};

export const createRenungan = async (data: FormData) => {
    const response = await apiService.post('/api/renungan', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const updateRenungan = async (id: number, data: FormData) => {
    const response = await apiService.put(`/api/renungan/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteRenungan = async (id: number) => {
    const response = await apiService.delete(`/api/renungan/${id}`);
    return response.data;
};
