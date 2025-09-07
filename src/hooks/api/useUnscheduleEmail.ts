import { request } from '@/lib/request.ts';
import { API } from '@/types.ts';
import api from '@/lib/api.ts';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useMainContext } from '@/App.tsx';

export const useUnscheduleEmail = () => {
    const [isLoading, setIsLoading] = useState(false);
    const context = useMainContext();

    const { email, updateEmail, newsletter } = context;

    const unscheduleEmail = async () => {
        setIsLoading(true);

        const [data, error] = await request<API.Email>(
            api.post(
                `/newsletters/${newsletter.id}/emails/${email!.id}/unschedule`,
            ),
        );
        setIsLoading(false);
        if (error) {
            toast.error('There was a problem with unscheduling e-mail');
            return;
        }
        updateEmail(data!);

        toast.success('Successfully cancelled sending of e-mail');
    };

    return {
        isLoading,
        unscheduleEmail,
    };
};
