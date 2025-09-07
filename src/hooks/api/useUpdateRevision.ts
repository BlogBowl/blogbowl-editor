import { request } from '@/lib/request.ts';
import { API } from '@/types.ts';
import api from '@/lib/api.ts';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useMainContext } from '@/App.tsx';

type UseUpdateRevisionProps = {
    successMessage: string;
    errorMessage: string;
};

export const useUpdateRevision = ({
    successMessage,
    errorMessage,
}: UseUpdateRevisionProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const context = useMainContext();

    const { post, updateRevision: updateRevisionContext } = context;

    const updateRevision = async (data: Partial<API.Revision>) => {
        setIsLoading(true);
        const [revisionData, revisionError] = await request<API.Revision>(
            api.patch(`/pages/${post.page_id}/posts/${post.id}/revisions/last`, data),
        );

        setIsLoading(false);
        if (revisionError) {
            toast.error(errorMessage);
            return;
        }
        updateRevisionContext(revisionData!);
        toast.success(successMessage);
    };

    return {
        isLoading,
        updateRevision,
        context,
    };
};
