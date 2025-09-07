import SidebarTabWrapper, {
    SidebarChildrenWrapper,
} from '@/components/sidebar/SidebarTabWrapper.tsx';
import { CommonTabProps } from '@/components/sidebar';
import { SubmitHandler, useForm } from 'react-hook-form';
import { SelectAuthor } from '@/components/core/Select/SelectAuthor.tsx';
import { useGetAuthors } from '@/hooks/api/useGetAuthors.ts';
import { mapAuthorsToOptions } from '@/lib/authors.ts';
import Input from '@/components/core/Input.tsx';
import { useUpdateEmail } from '@/hooks/api/useUpdateEmail.ts';

type EmailForm = {
    author_id: string;
    preview: string;
};

const EmailSidebarTab = ({ title }: CommonTabProps) => {
    const { updateEmail, isLoading, context } = useUpdateEmail();

    const {
        handleSubmit,
        control,
        formState: { errors, isDirty },
        register,
    } = useForm<EmailForm>({
        defaultValues: {
            preview: context?.email?.preview,
            author_id: context?.email?.author_id?.toString(),
        },
    });

    const { data } = useGetAuthors();

    const authors = mapAuthorsToOptions(data);

    const onSubmit: SubmitHandler<EmailForm> = async ({
        preview,
        author_id,
    }) => {
        await updateEmail({ preview, author_id: parseInt(author_id) });
    };

    return (
        <SidebarTabWrapper
            title={title}
            onSubmit={handleSubmit(onSubmit)}
            isLoading={isLoading}
            isDirty={isDirty}
        >
            <SidebarChildrenWrapper>
                <Input
                    label="E-mail preview"
                    name={'preview'}
                    placeholder="Enter preview text"
                    error={errors.preview}
                    {...{ register }}
                />
                <SelectAuthor
                    items={authors}
                    label={'Author'}
                    placeholder={'Select author'}
                    control={control}
                    name={'author_id'}
                    warningMessage={
                        !context?.email?.author_id
                            ? 'Add an author to send e-mail'
                            : ''
                    }
                />
            </SidebarChildrenWrapper>
        </SidebarTabWrapper>
    );
};

export default EmailSidebarTab;
