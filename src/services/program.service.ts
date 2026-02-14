import api from '../utils/axios';

export interface Program {
    id: number;
    bidang: string;
    sub_bidang?: string;
    nama_program: string;
    jenis_kegiatan: string;
    volume: number;
    waktu_pelaksanaan: string;
    rencana_biaya: number;
    keterangan?: string;
    created_at: string;
}

export const getPrograms = async (params?: { bidang?: string; startDate?: string; endDate?: string }) => {
    const response = await api.get('/api/programs', { params });
    return response.data;
};

export const createProgram = async (data: Omit<Program, 'id' | 'created_at'>) => {
    const response = await api.post('/api/programs', data);
    return response.data;
};

export const exportExcel = async (bidang?: string) => {
    const response = await api.get('/api/programs/export/excel', {
        params: { bidang },
        responseType: 'blob',
    });
    return response.data;
};

export const exportWord = async (bidang?: string) => {
    const response = await api.get('/api/programs/export/word', {
        params: { bidang },
        responseType: 'blob',
    });
    return response.data;
};

export const getProgramStats = async () => {
    const response = await api.get('/api/programs/stats');
    return response.data;
};

export const deleteProgram = async (id: number) => {
    const response = await api.delete(`/api/programs/${id}`);
    return response.data;
};
