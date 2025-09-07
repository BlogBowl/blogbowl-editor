import { FieldValues } from 'react-hook-form';
import { FormHookProps, InputProps } from '@/types.ts';
import { ReactNode } from 'react';
import { Label } from '@/components/ui/label.tsx';
import { cn } from '@/lib/utils';

const InputBaseWrapper = <T extends FieldValues>({
    className,
    error,
    label,
    name,
    children,
    withErrorMsg,
    warningMessage
}: Pick<InputProps, 'className' | 'label' | 'withErrorMsg' | 'warningMessage'> &
    Pick<FormHookProps<T>, 'error' | 'name'> & { children: ReactNode }) => {
    const isError = !!error;

    return (
        <div className={cn(className, 'relative w-full')}>
            {!!label && <div className={'mb-1 flex item-center justify-between'}>
                <Label htmlFor={name} className={'font-medium text-sm'}>{label}</Label>
                {warningMessage && <p className="text-xs text-error">{warningMessage}</p>}
            </div>}
            {children}
            {isError && withErrorMsg && !!error?.message && (
                <p
                    style={{ fontSize: '12px' }}
                    className={'text-error mt-0.5 absolute'}
                >
                    {error.message}
                </p>
            )}
        </div>
    );
};

export default InputBaseWrapper;
