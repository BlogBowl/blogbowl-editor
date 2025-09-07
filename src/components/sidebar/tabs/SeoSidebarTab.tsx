import { CommonTabProps } from '@/components/sidebar';
import SidebarTabWrapper, {
    SidebarChildrenWrapper,
} from '@/components/sidebar/SidebarTabWrapper.tsx';
import Input from '@/components/core/Input.tsx';
import { SubmitHandler, useForm } from 'react-hook-form';
import TextArea from '@/components/core/TextArea.tsx';
import Divider from '@/components/core/Divider.tsx';
import { useEffect } from 'react';
import { useUpdatePost } from '@/hooks/api/useUpdatePost.ts';
import ImageUploadForm from '@/components/core/ImageUploadForm.tsx';

type SeoSideBarForm = {
    slug: string;
    seoTitle: string;
    seoDescription: string;

    ogTitle: string;
    ogDescription: string;
    sharing_image: FileList;
};

const SeoSidebarTab = ({ title }: CommonTabProps) => {
    const {
        updatePost,
        isLoading: isPostLoading,
        context: { post },
    } = useUpdatePost({
        successMessage: 'Post settings updated successfully',
        errorMessage: 'Failed to update post settings',
    });

    const {
        register,
        formState: { errors, isDirty },
        setValue,
        handleSubmit,
        clearErrors,
        watch,
    } = useForm<SeoSideBarForm>({
        defaultValues: {
            slug: post?.slug || '',
            seoTitle: post?.seo_title ?? (post?.title || ''),
            seoDescription: post?.seo_description ?? (post?.description || ''),
            ogTitle: post?.og_title ?? (post?.title || ''),
            ogDescription: post?.og_description ?? (post?.description || ''),
        },
    });

    useEffect(() => {
        if (post?.slug) {
            setValue('slug', post.slug);
        }
    }, [post?.slug]);

    const onSubmit: SubmitHandler<SeoSideBarForm> = async ({
        slug,
        seoTitle,
        seoDescription,
        ogTitle,
        ogDescription,
        sharing_image,
    }) => {
        await updatePost({
            slug,
            sharing_image,
            seo_title: seoTitle,
            seo_description: seoDescription,
            og_title: ogTitle,
            og_description: ogDescription,
        });
    };

    const currentImage = watch('sharing_image');

    return (
        <SidebarTabWrapper
            title={title}
            onSubmit={handleSubmit(onSubmit)}
            isLoading={isPostLoading}
            isDirty={isDirty}
            warningMessage="⚠️ These settings will be published immediately and automatically override your current post configuration."
        >
            <SidebarChildrenWrapper>
                <Input
                    label="Post slug"
                    name={'slug'}
                    placeholder="Enter category name"
                    error={errors.slug}
                    {...{ register }}
                    isRequired
                />
                <Input
                    label="SEO title"
                    name={'seoTitle'}
                    placeholder="Enter SEO title"
                    error={errors.slug}
                    {...{ register }}
                />
                <TextArea
                    label={'SEO description'}
                    placeholder={'Enter SEO description'}
                    {...{ register }}
                    name={'seoDescription'}
                    rows={2}
                />
            </SidebarChildrenWrapper>
            <Divider className={'my-5'} />
            <SidebarChildrenWrapper>
                <p className={'font-bold'}>Open Graph</p>
                <Input
                    label="OG title"
                    name={'ogTitle'}
                    placeholder="Enter OG title"
                    error={errors.ogTitle}
                    {...{ register }}
                />
                <TextArea
                    label={'OG description'}
                    placeholder={'Enter OG description'}
                    {...{ register }}
                    name={'ogDescription'}
                    rows={2}
                />
                <ImageUploadForm
                    name={'sharing_image'}
                    register={register}
                    label={'OG image'}
                    setValue={setValue}
                    currentImage={currentImage}
                    // isRequired={true}
                    error={errors.sharing_image}
                    clearErrors={clearErrors}
                    defaultImage={post?.sharing_image ?? post?.cover_image}
                />
            </SidebarChildrenWrapper>
        </SidebarTabWrapper>
    );
};

export default SeoSidebarTab;
