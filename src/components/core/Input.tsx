import { FieldValues } from 'react-hook-form';
import { FormHookProps, InputProps } from '@/types.ts';
import InputBaseWrapper from '@/components/core/InputBaseWrapper.tsx';
import { cn } from '@/lib/utils';

const Input = <T extends FieldValues>({
    label,
    isRequired = false,
    className = '',
    register,
    name,
    error,
    placeholder,
    rules,
    disabled = false,
    size = 'small',
    type = 'text',
    withErrorMsg = true,
}: InputProps & FormHookProps<T>) => {
    const require = {
        value: isRequired,
        message: '* This field is required',
    };

    const isSmall = size === 'small';

    const isError = !!error;

    return (
        <InputBaseWrapper {...{ label, className, name, error, withErrorMsg }}>
            <input
                {...register(
                    name,
                    rules
                        ? { required: require, ...rules }
                        : { required: require },
                )}
                className={cn(
                    'flex h-10 w-full rounded-md border border-input focus:border-input-focus px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus:ring-input-focus-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                    isError ? 'border-error' : 'border-input-border',
                    disabled ? 'cursor-not-allowed' : '',
                    isSmall ? 'p-2' : 'p-4',
                    label ? 'mt-2 ' : '',
                    className,
                )}
                {...{ placeholder, disabled, type }}
            />
        </InputBaseWrapper>
    );
};

export default Input;
