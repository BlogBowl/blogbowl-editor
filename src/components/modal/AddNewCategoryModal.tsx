import { DialogFooter } from '@/components/ui/dialog';
import { Dispatch, SetStateAction, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Input from '@/components/core/Input.tsx';
import TextArea from '@/components/core/TextArea.tsx';
import ColorsPicker from '@/components/core/ColorsPicker.tsx';
import { Trash2 } from 'lucide-react';
import { useAddCategory } from '@/hooks/api/useAddCategories.ts';
import { formatFormDataWithFiles, request } from '@/lib/request.ts';
import { Category } from '@/types.ts';
import { toast } from 'react-hot-toast';
import { useGetCategories } from '@/hooks/api/useGetCategories.ts';
import { Button } from '@/components/ui/button.tsx';
import { CategoryItem } from '@/components/core/Select/SelectCategory.tsx';
import Modal2ColumnUI from '@/components/modal/Modal2ColumnUI.tsx';
import ImageUploadForm from '@/components/core/ImageUploadForm.tsx';

type AddNewCategoryModal = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

type CategoryForm = {
    name: string;
    description: string;
    color: string;
    og_image: FileList;
};

export function AddNewCategoryModal({ open, setOpen }: AddNewCategoryModal) {
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        watch,
        clearErrors,
        reset,
    } = useForm<CategoryForm>();

    const { mutateAsync } = useAddCategory();

    const { categories } = useGetCategories({ selectedCategoryId: null });

    const onSubmit: SubmitHandler<CategoryForm> = async (
        data: CategoryForm,
    ) => {
        setIsLoading(true);
        const [, error] = await request<Category>(
            mutateAsync(formatFormDataWithFiles(data, ['og_image'])),
        );

        setIsLoading(false);

        if (error) {
            const nameError = error?.data?.name?.[0];
            toast.error(
                `An error occurred while creating the category: ${nameError ? `Name ${nameError}` : 'Unknown error'}`,
            );
            return;
        }

        toast.success('Category created successfully');

        reset({
            name: null,
            description: null,
            color: null,
            og_image: null,
        });
        // close modal
        setOpen(false);
    };

    const categoriesColumn = (
        <div className={'flex flex-col gap-y-3 py-5 px-2 min-w-[175px]'}>
            {categories.map((category, index) => (
                <AddNewCategoryModal.CategoryItem
                    {...category}
                    key={`post-category-${index}`}
                />
            ))}
        </div>
    );

    const currentImage = watch('og_image');

    return (
        <Modal2ColumnUI
            open={open}
            setOpen={setOpen}
            title={'New category 🖋️'}
            description={
                'Note: Colors are only for you. Categories will be displayed on your blog if they have at least one article.'
            }
            dialogContentClassName={'w-1/2'}
            column2Children={categoriesColumn}
            column2Title={'Categories'}
        >
            <div className="flex flex-col gap-y-4 py-4">
                <Input
                    label="Category name"
                    name={'name'}
                    placeholder="Enter category name"
                    error={errors.name}
                    {...{ register }}
                    isRequired
                />
                <TextArea
                    label="Category description"
                    name={'description'}
                    placeholder="Enter category description"
                    error={errors.description}
                    {...{ register }}
                    isRequired
                />
                <ImageUploadForm
                    name={'og_image'}
                    register={register}
                    label={'OG image (optional)'}
                    setValue={setValue}
                    currentImage={currentImage}
                    // isRequired={true}
                    error={errors.og_image}
                    clearErrors={clearErrors}
                />
                <ColorsPicker control={control} name={'color'} />
            </div>
            <DialogFooter>
                <Button
                    type="submit"
                    className={'w-full'}
                    variant={'default'}
                    isLoading={isLoading}
                    onClick={handleSubmit(onSubmit)}
                >
                    Create
                </Button>
            </DialogFooter>
        </Modal2ColumnUI>
    );
}

AddNewCategoryModal.CategoryItem = ({ color, label }: CategoryItem) => {
    return (
        <div className={'flex items-center justify-between min-w-40'}>
            <div
                className={'px-2 py-1 rounded text-xs w-fit font-medium'}
                style={{
                    backgroundColor: `${color}40`,
                }}
            >
                {label}
            </div>
            <div className={'cursor-pointer hover:opacity-70 hover:active-50'}>
                <Trash2 className={'w-4 h-4 text-gray-400'} />
            </div>
        </div>
    );
};
