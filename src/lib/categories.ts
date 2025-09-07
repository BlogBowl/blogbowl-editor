import { Category } from '@/types.ts';
import { CategoryItem } from '@/components/core/Select/SelectCategory.tsx';

export const getCategories = (data: Category[] | undefined): CategoryItem[] => {
    if (!data) {
        return [];
    }

    return (
        data
            .filter(category => category.parent_id === null)
            .map(categoryToCategoryItemMap) ?? []
    );
};

export const categoryToCategoryItemMap = (
    category: Category,
): CategoryItem => ({
    label: category.name,
    // @ts-exoect-error will be fixed
    value: category.id as unknown as string,
    color: category.color!,
});
