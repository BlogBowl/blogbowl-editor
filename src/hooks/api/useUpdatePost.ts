import { formatFormDataWithFiles, request } from '@/lib/request.ts';
import { API } from '@/types.ts';
import api from '@/lib/api.ts';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useMainContext } from '@/App.tsx';

type UseUpdatePostProps = {
    successMessage: string;
    errorMessage: string;
};

export const useUpdatePost = ({
    successMessage,
    errorMessage,
}: UseUpdatePostProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const context = useMainContext();

    const { post, updatePost: updatePostContext } = context;

    const updatePost = async (
        postData: Partial<Omit<API.Post, 'cover_image' | 'sharing_image'>> & {
            author_ids?: number[];
            reviewer_ids?: number[];
            cover_image?: FileList;
            sharing_image?: FileList;
        },
    ) => {
        setIsLoading(true);

        const [data, error] = await request<API.Post>(
            api.patch(
                `/pages/${post.page_id}/posts/${post!.id}`,
                formatFormDataWithFiles(postData, [
                    'cover_image',
                    'sharing_image',
                ]),
            ),
        );
        setIsLoading(false);
        if (error) {
            toast.error(errorMessage);
            return;
        }
        updatePostContext(data!);

        toast.success(successMessage);
    };

    return {
        isLoading,
        updatePost,
        context,
    };
};
