import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api.ts';
import { Category } from '@/types';
import { getCategories } from '@/lib/categories.ts';
import {useMainContext} from "@/App.tsx";

const queryFn = async (pageId: number) => {
    return api.get(`/pages/${pageId}/categories`).then(response => response.data);
};

type UseGetCategoriesProps = {};

export const useGetCategories = ({}: UseGetCategoriesProps) => {
    const queryKey = ['categories'];

    const context = useMainContext();
    const { post } = context;

    const { data, isLoading, isRefetching, ...rest } = useQuery<Category[]>({
        queryKey,
        queryFn: () => queryFn(post.page_id),
    });

    return {
        data,
        categories: getCategories(data),
        isLoading: isLoading || isRefetching,
        ...rest,
    };
};
