import { request } from '@/lib/request.ts';
import { API } from '@/types.ts';
import api from '@/lib/api.ts';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useMainContext } from '@/App.tsx';

export const useShareLastRevision = () => {
    const [isLoading, setIsLoading] = useState(false);
    const context = useMainContext();

    const { post, updateRevision: updateRevisionContext, revision } = context;

    const shareLastRevision = async () => {
        if (revision?.share_id) {
            openRevisionReview(revision.share_id)
            return;
        }

        setIsLoading(true);
        const [revisionData, revisionError] = await request<API.Revision>(
            api.post(`/pages/${post.page_id}/posts/${post.id}/revisions/last/share`),
        );

        setIsLoading(false);
        if (revisionError) {
            if (revisionError.data?.error) {
                toast.error(`There was an error generating preview: \n* ${revisionError.data?.error}`);
                return;
            }
            toast.error("There was an error generating preview!");
            return;
        }
        updateRevisionContext(revisionData!);
        toast.success("Preview successfully generated!");
        openRevisionReview(revisionData!.share_id!);
    };

    const openRevisionReview = (shareId: string) => {
        window.open(`${window.cfg.host}/preview/${shareId}`, '_blank')
    }

    return {
        isLoading,
        shareLastRevision,
        context,
    };
};
