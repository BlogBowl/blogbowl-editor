import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { cn } from '@/lib/utils';

export type RadioOption = {
    label: string;
    value: string;
};

type ColorsPickerType<T extends FieldValues> = {
    control: Control<T>;
    defaultValue?: T;
    name?: Path<T>;
    options: RadioOption[];
};

const RadioGroupBadge = <T extends FieldValues>({
    control,
    name = 'sendType' as Path<T>,
    options,
}: ColorsPickerType<T>) => {
    const {
        field: { value, onChange },
    } = useController<T>({
        name,
        control,
    });

    return (
        <div className={'flex items-center gap-x-2'}>
            {options.map(option => {
                const isSelected = value === option.value;
                return (
                    <div
                        className={cn(
                            'px-4 py-2 rounded-full border-2 hover:scale-[1.05] text-gray-600 transition duration-150 flex items-center justify-center truncate cursor-pointer',
                            isSelected
                                ? 'border-primary text-foreground bg-gray-100'
                                : '',
                        )}
                        onClick={() => onChange(option.value)}
                        key={`radio-option-${option.value}`}
                    >
                        <p className={'text-sm font-medium'}>{option.label}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default RadioGroupBadge;
