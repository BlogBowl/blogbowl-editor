import { request } from '@/lib/request.ts';
import { API } from '@/types.ts';
import api from '@/lib/api.ts';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useMainContext } from '@/App.tsx';


export const usePublishPost = () => {
    const [isLoading, setIsLoading] = useState(false);
    const context = useMainContext();

    const { post, updatePost: updatePostContext, updateRevision, revision } = context;

    const publishPost = async () => {
        setIsLoading(true);

        const [data, error] = await request<API.Post>(
            api.post(`/pages/${post.page_id}/posts/${post!.id}/publish`),
        );
        setIsLoading(false);
        if (error) {
            if (error.data?.error) {
                toast.error(`There was an error publishing post: \n* ${error.data?.error}`);
                return;
            }
            toast.error("There was an error publishing post!");
            return;
        }
        updatePostContext(data!);
        updateRevision({...revision!, kind: 'history'});

        toast.success("Post was successfully published");
    };

    return {
        isLoading,
        publishPost,
        context,
    };
};
