import { SelectItem } from '@/components/ui/select.tsx';
import { CirclePlus } from 'lucide-react';
import SelectBase, {
    SelectBaseProps,
    SelectItemBaseProps,
} from '@/components/core/Select/SelectBase.tsx';
import { FieldValues } from 'react-hook-form';
import { cn } from '@/lib/utils';

export type CategoryItem = SelectItemBaseProps & {
    color: string;
};

type SelectCategoryProps<V extends FieldValues> = Omit<
    SelectBaseProps<CategoryItem, V>,
    'renderItem'
> & {
    addNewCallback?: () => void;
    addNewTitle: string;
};

export function SelectCategory<V extends FieldValues>({
    addNewCallback,
    addNewTitle,
    ...rest
}: SelectCategoryProps<V>) {
    const openModalButton = (
        <div
            className={
                'mt-2 flex items-center justify-center cursor-pointer py-2 border-t active:opacity-50 hover:opacity-70'
            }
            onClick={addNewCallback}
        >
            <span className={'text-gray-500 mr-2 text-sm'}>{addNewTitle}</span>
            <CirclePlus className={'h-4 w-4 text-gray-500'} />
        </div>
    );

    return (
        <SelectBase
            {...rest}
            renderItem={RenderItem}
            button={addNewCallback && openModalButton}
        />
    );
}

const RenderItem = ({ value, color, label }: CategoryItem) => {
    return (
        <SelectItem
            value={value}
            key={`category-select-${value}`}
            className={'px-3'}
        >
            <div className={'flex flex-row items-center'}>
                <div
                    style={{ backgroundColor: color }}
                    className={cn('w-4 h-4 rounded-sm mr-2')}
                />
                <p>{label}</p>
            </div>
        </SelectItem>
    );
};
