import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api.ts';
import { API } from '@/types';
import { useMainContext } from '@/App.tsx';

const queryFn = async (postId: number, pageId: number) => {
    return api
        .get(`/pages/${pageId}/posts/${postId}/revisions`)
        .then(response => response.data);
};

export const useGetRevisions = () => {
    const context = useMainContext();

    const { post } = context;

    const queryKey = ['revisions'];
    const { data, isLoading, isRefetching, ...rest } = useQuery<API.Revision[]>(
        {
            queryKey,
            queryFn: () => (post.id ? queryFn(post.id, post.page_id) : []),
        },
    );

    return {
        data,
        isLoading: isLoading || isRefetching,
        ...rest,
    };
};
