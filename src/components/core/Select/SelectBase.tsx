import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ReactNode } from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';

export type SelectItemBaseProps = {
    label: string;
    value: string;
};

export type SelectBaseProps<
    T extends SelectItemBaseProps,
    V extends FieldValues,
> = {
    items: T[];
    label: string;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
    button?: ReactNode;
    renderItem: (item: T) => ReactNode;
    name: Path<V>;
    control: Control<V>;
    warningMessage?: string;
};

const SelectBase = <T extends SelectItemBaseProps, V extends FieldValues>({
    items,
    className,
    placeholder,
    disabled,
    label,
    button,
    renderItem,
    name,
    control,
    warningMessage
}: SelectBaseProps<T, V>) => {
    const {
        field: { value, onChange },
    } = useController<V>({
        name,
        control,
    });

    return (
        <div className={cn('w-full', className)}>
            <div className={'mb-1 flex item-center justify-between'}>
                <Label htmlFor={name} className={'font-medium text-sm'}>{label}</Label>
                {warningMessage && <p className="text-xs text-error">{warningMessage}</p>}
            </div>
            <Select disabled={disabled} onValueChange={onChange} value={value}>
                <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {items.map(data => renderItem(data))}
                    {!!button && button}
                </SelectContent>
            </Select>
        </div>
    );
};

export default SelectBase;
