import { SelectItem } from '@/components/ui/select.tsx';
import SelectBase, {
    SelectBaseProps,
    SelectItemBaseProps,
} from '@/components/core/Select/SelectBase.tsx';
import { cn } from '@/lib/utils';
import { FieldValues } from 'react-hook-form';
import { Icon } from '@/components/tiptap/ui/Icon.tsx';

export type AuthorItem = SelectItemBaseProps & {
    avatar?: string;
};

type SelectAuthorProps<T extends FieldValues> = Omit<
    SelectBaseProps<AuthorItem, T>,
    'renderItem'
> & {
    //
};

export function SelectAuthor<T extends FieldValues>({
    ...rest
}: SelectAuthorProps<T>) {
    return <SelectBase {...rest} renderItem={RenderItem} />;
}

const RenderItem = ({ value, avatar, label }: AuthorItem) => {
    return (
        <SelectItem
            value={value}
            key={`category-select-${value}`}
            className={'px-3'}
        >
            <div className={'flex flex-row items-center'}>
                <div className={cn('w-4 h-4 rounded-sm mr-2')}>
                    {avatar ? <img
                        src={avatar}
                        alt={'label'}
                        className={'w-4 h-4 rounded-sm'}
                    /> : <Icon name="UserRound" /> }
                </div>

                <p>{label}</p>
            </div>
        </SelectItem>
    );
};
