import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label.tsx';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { Check, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const NICE_COLORS = [
    '#73C7E1',
    '#FFB553',
    '#FD84E1',
    '#F26279',
    '#03BD9D',
    '#AF8AF4',
    '#EAD61A',
    '#FF7F50',
    '#40E0D0',
    '#DA70D6',
    '#DAA520',
    '#87CEEB',
    '#FA8072',
    '#6A5ACD',
    '#3CB371',
    '#CD853F',
    '#FF69B4',
    '#5F9EA0',
    '#DB7093',
    '#778899',
];

type ColorsPickerType<T extends FieldValues> = {
    control: Control<T>;
    defaultValue?: T;
    name?: Path<T>;
};

const ColorsPicker = <T extends FieldValues>({
    control,
    name = 'color' as Path<T>,
}: ColorsPickerType<T>) => {
    const [colorsList, setColorsList] = useState(NICE_COLORS.slice(0, 7));
    const [showMore, setShowMore] = useState(false);

    const {
        field: { value, onChange },
    } = useController<T>({
        name,
        control,
    });

    useEffect(() => {
        if (showMore) {
            setColorsList(NICE_COLORS);
            return;
        }
        setColorsList(NICE_COLORS.slice(0, 7));
    }, [showMore]);

    const isCustomColorSelected =
        !NICE_COLORS.includes(value) && value !== '#ffffff' && !!value;

    return (
        <div>
            <Label>Select a color (optional)</Label>
            <div
                className={
                    'grid grid-cols-7 gap-x-2 gap-y-2 mt-2 cursor-pointer'
                }
            >
                {colorsList.map(color => {
                    const isSelected = value === color;
                    return (
                        <div
                            className={cn(
                                'w-8 h-8 rounded-sm bg-red-500 hover:scale-[1.05] transition duration-150 flex items-center justify-center',
                                isSelected ? 'scale-[1.05]' : '',
                            )}
                            style={{ backgroundColor: color }}
                            onClick={() => onChange(color)}
                            key={`colors-picker-${color}`}
                        >
                            {isSelected && (
                                <Check className={'w-4 h-4 text-white'} />
                            )}
                        </div>
                    );
                })}
                {showMore && (
                    <div
                        className={
                            'relative items-center justify-center w-fit rounded overflow-hidden'
                        }
                    >
                        <input
                            type="color"
                            className="p-1 h-8 w-8 bg-white border border-gray-200 cursor-pointer rounded block"
                            value={
                                NICE_COLORS.includes(value) ? '#ffffff' : value
                            }
                            defaultValue={'#ffffff'}
                            id="hs-color-input"
                            title="Choose your color"
                            onChange={event => onChange(event.target.value)}
                        />
                        <div
                            className={
                                'absolute flex items-center justify-center top-0 bottom-0 right-0 left-0 pointer-events-none'
                            }
                        >
                            {isCustomColorSelected ? (
                                <Check className={'w-4 h-4 text-white'} />
                            ) : (
                                <Plus className={'text-gray-500'} />
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div
                className={
                    'flex items-center mt-1 cursor-pointer hover:opacity-70 active:opacity-50'
                }
                onClick={() => setShowMore(prevState => !prevState)}
            >
                <p className={'text-xs text-gray-400'}>
                    {showMore ? 'hide' : 'more colors'}
                </p>
                {showMore ? (
                    <ChevronUp className={'h-4 w-4 text-gray-400'} />
                ) : (
                    <ChevronDown className={'h-4 w-4 text-gray-400'} />
                )}
            </div>
        </div>
    );
};

export default ColorsPicker;
