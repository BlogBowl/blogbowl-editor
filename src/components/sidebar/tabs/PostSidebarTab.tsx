import SidebarTabWrapper, {
    SidebarChildrenWrapper,
} from '@/components/sidebar/SidebarTabWrapper.tsx';
import { CommonTabProps } from '@/components/sidebar';
import { SelectCategory } from '@/components/core/Select/SelectCategory.tsx';
import { AddNewCategoryModal } from '@/components/modal/AddNewCategoryModal.tsx';
import { useState } from 'react';
import Divider from '@/components/core/Divider.tsx';
import SelectMultipleAuthors from '@/components/core/MultiSelect/SelectMultipleAuthors.tsx';
import { useGetCategories } from '@/hooks/api/useGetCategories';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useUpdatePost } from '@/hooks/api/useUpdatePost.ts';
import { AuthorItem } from '@/components/core/Select/SelectAuthor.tsx';
import { useGetAuthors } from '@/hooks/api/useGetAuthors.ts';
import { mapAuthorsToOptions, mapAuthorToOption } from '@/lib/authors.ts';
import ImageUploadForm from '@/components/core/ImageUploadForm.tsx';
import TextArea from '@/components/core/TextArea.tsx';

type PostForm = {
    description: string;
    category_id: number;
    authors: AuthorItem[];
    reviewers: AuthorItem[];
    cover_image: FileList;
};

const PostSidebarTab = ({ title }: CommonTabProps) => {
    const [addCategoryOpen, setAddCategoryOpen] = useState(false);

    const { updatePost, isLoading, context } = useUpdatePost({
        successMessage: 'Post settings updated successfully',
        errorMessage: 'Failed to update post settings',
    });

    const {
        handleSubmit,
        control,
        watch,
        setValue: setFormValue,
        formState: { errors, isDirty },
        register,
        clearErrors,
    } = useForm<PostForm>({
        defaultValues: {
            category_id: context?.post?.category_id,
            authors: context?.post?.authors?.map(mapAuthorToOption),
            reviewers: context?.post?.reviewers?.map(mapAuthorToOption),
            description: context?.post?.description,
        },
    });

    const selectedCategoryId = watch('category_id');
    const selectedAuthors = watch('authors');

    const { categories } = useGetCategories({
        selectedCategoryId,
    });

    const { data } = useGetAuthors();

    const authors = mapAuthorsToOptions(data);
    const reviewers = authors.filter(
        author =>
            !selectedAuthors ||
            !selectedAuthors.some(
                selectedAuthors => selectedAuthors.value === author.value,
            ),
    );

    const onSubmit: SubmitHandler<PostForm> = async ({
        category_id,
        cover_image,
        authors,
        reviewers,
        description,
    }) => {
        await updatePost({
            category_id: category_id,
            author_ids: authors?.map(author => parseInt(author.value)),
            reviewer_ids: reviewers?.map(author => parseInt(author.value)),
            cover_image: cover_image,
            description: description,
        });
    };

    const currentImage = watch('cover_image');

    return (
        <>
            <SidebarTabWrapper
                title={title}
                onSubmit={handleSubmit(onSubmit)}
                isLoading={isLoading}
                isDirty={isDirty}
                warningMessage="⚠️ These settings will be published immediately and automatically override your current post configuration."
            >
                <SidebarChildrenWrapper>
                    <ImageUploadForm
                        name={'cover_image'}
                        register={register}
                        label={'Cover image'}
                        setValue={setFormValue}
                        currentImage={currentImage}
                        // isRequired={true}
                        error={errors.cover_image}
                        clearErrors={clearErrors}
                        defaultImage={context?.post?.cover_image}
                    />
                    <TextArea
                        label={'Description'}
                        placeholder={'Enter description of post...'}
                        {...{ register }}
                        name={'description'}
                        rows={3}
                        isRequired
                        error={errors?.description}
                        warningMessage={
                            !context?.post?.description
                                ? 'Add description to publish/preview'
                                : ''
                        }
                    />
                    <SelectCategory
                        items={categories}
                        label={'Category'}
                        placeholder={'Select category'}
                        addNewCallback={() => setAddCategoryOpen(true)}
                        addNewTitle={'New category'}
                        control={control}
                        name={'category_id'}
                    />
                </SidebarChildrenWrapper>
                <Divider className={'my-5'} />
                <SidebarChildrenWrapper>
                    <SelectMultipleAuthors
                        options={authors}
                        placeholder={'Select author(s)'}
                        label={'Authors'}
                        control={control}
                        name={'authors'}
                        warningMessage={
                            !context?.post?.authors?.length
                                ? 'Add an author to publish/preview'
                                : ''
                        }
                    />
                    <SelectMultipleAuthors
                        label={'Reviewers'}
                        options={reviewers}
                        placeholder={'Select reviewed by author(s)'}
                        control={control}
                        name={'reviewers'}
                    />
                </SidebarChildrenWrapper>
            </SidebarTabWrapper>
            <AddNewCategoryModal
                open={addCategoryOpen}
                setOpen={setAddCategoryOpen}
            />
        </>
    );
};

export default PostSidebarTab;
