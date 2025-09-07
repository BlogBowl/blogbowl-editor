import MultipleSelect, {
    MultipleSelectOption,
    MultipleSelectorProps,
} from '@/components/core/MultiSelect/MultipleSelect.tsx';
import { Label } from '@/components/ui/label.tsx';
import { cn } from '@/lib/utils';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { Icon } from '@/components/tiptap/ui/Icon.tsx';

export type AuthorItem = MultipleSelectOption & {
    avatar?: string;
};

type SelectMultipleAuthorsProps<V extends FieldValues> = Omit<
    MultipleSelectorProps<AuthorItem>,
    'renderItem'
> & {
    control: Control<V>;
    name: Path<V>;
    label: string;
    warningMessage?: string;
};

const SelectMultipleAuthors = <V extends FieldValues>({
    label,
    control,
    name,
    warningMessage,
    ...rest
}: SelectMultipleAuthorsProps<V>) => {
    const {
        field: { value, onChange },
    } = useController<V>({
        name,
        control,
    });

    return (
        <div className={cn('w-full', '')}>
            <div className={'mb-1 flex item-center justify-between'}>
                <Label className={'font-medium text-sm'}>{label}</Label>
                {warningMessage && (
                    <p className="text-xs text-error">{warningMessage}</p>
                )}
            </div>
            <MultipleSelect
                {...rest}
                value={value}
                onChange={onChange}
                renderItem={RenderItem}
                emptyState="No authors to show right now!"
            />
        </div>
    );
};

const RenderItem = ({ avatar, label, value }: AuthorItem) => {
    return (
        <div className={'flex flex-row items-center'} key={`author-${value}`}>
            <div className={cn('w-4 h-2 rounded-sm mr-2')}>
                {!!avatar ? (
                    <img
                        src={avatar}
                        alt={'label'}
                        className={'w-4 h-4 rounded-sm'}
                    />
                ) : (
                    <Icon name={'UserRound'} />
                )}
            </div>
            <p>{label}</p>
        </div>
    );
};

export default SelectMultipleAuthors;
