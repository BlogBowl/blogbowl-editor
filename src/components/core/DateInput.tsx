import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { Button } from '@/components/ui/button.tsx';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

type DateInputProps<T extends FieldValues> = {
    control: Control<T>;
    name: Path<T>;
};

const DateInput = <T extends FieldValues>({
    name,
    control,
}: DateInputProps<T>) => {
    const {
        field: { value, onChange },
    } = useController<T>({
        name,
        control,
    });

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !value && 'text-muted-foreground',
                    )}
                >
                    {value ? format(value, 'PPP') : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
};

export default DateInput;
