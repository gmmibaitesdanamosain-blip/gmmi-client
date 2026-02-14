import api from '../utils/axios';

export interface CarouselSlide {
    id: number;
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
    const response = await api.get('/api/carousel');
    return response.data.data;
};

export const getCarouselSlidesAdmin = async (): Promise<CarouselSlide[]> => {
    const response = await api.get('/api/carousel/admin');
    return response.data.data;
};

export const createCarouselSlide = async (formData: FormData): Promise<CarouselSlide> => {
    const response = await api.post('/api/carousel', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data.data;
};

export const updateCarouselSlide = async (id: number, formData: FormData): Promise<CarouselSlide> => {
    const response = await api.put(`/api/carousel/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data.data;
};

export const deleteCarouselSlide = async (id: number): Promise<void> => {
    await api.delete(`/api/carousel/${id}`);
};
