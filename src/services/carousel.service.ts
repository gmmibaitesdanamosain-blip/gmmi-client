import api from '../utils/axios';

export interface CarouselSlide {
    id: string;
    title: string;
    subtitle: string;
    quote: string;
    badge: string;
    image_url: string;
    cta_text: string;
    cta_link: string;
    order_index: number;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export const getCarouselSlides = async (): Promise<CarouselSlide[]> => {
    try {
        const response = await api.get('/api/carousel');
        const slides = response.data?.data
        return slides.filter((slide: CarouselSlide) => slide.is_active);
    } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : 'Gagal mengambil data carousel');
    }
};

export const getCarouselSlidesAdmin = async (): Promise<CarouselSlide[]> => {
    try {
        const response = await api.get('/api/carousel/admin');
        return response.data.data;
    } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : 'Gagal mengambil data carousel admin');
    }
};

export const createCarouselSlide = async (formData: FormData): Promise<CarouselSlide> => {
    try {
        const response = await api.post('/api/carousel', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data.data;
    } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : 'Gagal membuat slide carousel baru');
    }
};

export const updateCarouselSlide = async (id: string, formData: FormData): Promise<CarouselSlide> => {
    try {
        const response = await api.put(`/api/carousel/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data.data;
    } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : 'Gagal memperbarui slide carousel');
    }
};

export const deleteCarouselSlide = async (id: string): Promise<void> => {
    try {
        await api.delete(`/api/carousel/${id}`);
    } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : 'Gagal menghapus slide carousel');
    }
};
