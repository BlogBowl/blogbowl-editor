import axios, { AxiosProgressEvent } from 'axios';
import { request } from '@/lib/request.ts';

// probably just take it from window?

const api = axios.create({
    baseURL: window.cfg.host + '/api/internal/',
});

api.interceptors.request.use(config => {
    // @ts-expect-error Content is attribute of HTMLMetaElement
    const token = document.querySelector('[name="csrf-token"]')?.content;
    if (token) {
        config.headers['X-CSRF-Token'] = token;
    }
    return config;
});

export default api;

export class API {
    public static uploadImage = async (
        file: File,
        path: string,
        onProgress?: (progressEvent: AxiosProgressEvent) => void,
    ) => {
        const formData = new FormData();
        formData.append('file', file);
        const [data, error] = await request<{
            url: string;
        }>(
            api.post(path, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: onProgress,
            }),
        );

        if (error) {
            return;
        }

        return data!.url!;
    };
}
