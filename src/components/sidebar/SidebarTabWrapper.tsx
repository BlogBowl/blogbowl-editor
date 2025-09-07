import { ReactNode } from 'react';
import { CommonTabProps } from '@/components/sidebar/index.tsx';
import { Button } from '@/components/ui/button';

type SidebarTabWrapperProps = {
    children: ReactNode;
    onSubmit?: () => void;
    isLoading?: boolean;
    warningMessage?: string;
    isDirty?: boolean;
    buttonLabel?: string;
} & CommonTabProps;

const SidebarTabWrapper = ({
    children,
    title,
    onSubmit,
    isLoading = false,
    isDirty = true,
    warningMessage,
    buttonLabel = 'Save settings',
}: SidebarTabWrapperProps) => {
    return (
        <div className={'flex flex-col gap-y-3 justify-between h-full'}>
            <div>
                <p className={'font-bold text-lg my-3 px-4'}>{title}</p>
                {children}
            </div>
            {!!onSubmit && (
                <div className={'px-4 flex flex-col gap-y-3 pb-5'}>
                    <Button
                        type="submit"
                        className={'w-full'}
                        variant={'default'}
                        onClick={onSubmit}
                        isLoading={isLoading}
                        disabled={!isDirty}
                    >
                        {buttonLabel}
                    </Button>
                    {!!warningMessage && (
                        <p className={'text-gray-500 text-sm'}>
                            {warningMessage}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export const SidebarChildrenWrapper = ({
    children,
}: {
    children: ReactNode;
}) => <div className={'px-4 flex flex-col gap-y-3'}>{children}</div>;

export default SidebarTabWrapper;
