import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api.ts';
import { API } from '@/types';

const queryFn = async () => {
    return api.get('/authors').then(response => response.data);
};

export const useGetAuthors = () => {
    const queryKey = ['authors'];
    const { data, isLoading, isRefetching, ...rest } = useQuery<API.Author[]>({
        queryKey,
        queryFn: () => queryFn(),
    });

    return {
        data,
        isLoading: isLoading || isRefetching,
        ...rest,
    };
};
