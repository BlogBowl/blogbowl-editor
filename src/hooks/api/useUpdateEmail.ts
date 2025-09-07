import { useState } from 'react';
import { useMainContext } from '@/App.tsx';
import { API } from '@/types.ts';
import { request } from '@/lib/request.ts';
import api from '@/lib/api.ts';
import toast from 'react-hot-toast';

export const useUpdateEmail = () => {
    const [isLoading, setIsLoading] = useState(false);
    const context = useMainContext();

    const { email, updateEmail: updateEmailContext, newsletter } = context;

    const updateEmail = async (emailData: Partial<API.Email>) => {
        setIsLoading(true);

        const [data, error] = await request<API.Email>(
            api.put(
                `/newsletters/${newsletter.id}/emails/${email!.id}`,
                emailData,
            ),
        );
        setIsLoading(false);
        if (error) {
            toast.error('Failed to update email settings');
            return;
        }
        updateEmailContext(data!);

        toast.success('Email settings updated successfully');
    };

    return {
        isLoading,
        updateEmail,
        context,
    };
};
