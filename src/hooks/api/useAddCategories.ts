import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api.ts';
import { Category } from '@/types.ts';
import { AxiosResponse } from 'axios';
import {useMainContext} from "@/App.tsx";

const mutationFn = (body: Category, pageId: number): Promise<AxiosResponse<Category>> =>
    api.post<Category>(`/pages/${pageId}/categories`, body);

export const useAddCategory = () => {
    const queryClient = useQueryClient();

    const context = useMainContext();
    const { post } = context;

    const { isPending, ...rest } = useMutation({
        mutationFn: (body: Category) => mutationFn(body, post.page_id),
        mutationKey: ['categories'],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });

    return {
        isLoading: isPending,
        ...rest,
    };
};
