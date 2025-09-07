import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog.tsx';
import Input from '@/components/core/Input.tsx';
import { RegisterOptions, SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@/components/tiptap/ui/Button.tsx';
import { Icon } from '@/components/tiptap/ui/Icon.tsx';
import { icons } from 'lucide-react';
import { Editor } from '@tiptap/core';

export type GenericModalProps = {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    type: GenericModalUrlType;
    editor: Editor;
};

const urlValidation: RegisterOptions<FormData> = {
    pattern: {
        value: new RegExp(
            '((([A-Za-z]{3,9}:(?:\\/\\/)?)(?:[-;:&=\\+\\$,\\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\\+\\$,\\w]+@)[A-Za-z0-9.-]+)((?:\\/[\\+~%\\/.\\w-_]*)?\\??(?:[-\\+=&;%@.\\w_]*)#?(?:[.\\!\\/\\\\w]*))?)',
        ),
        message: 'Please, enter correct url with',
    },
};

export enum GenericModalUrlType {
    twitter = 'twitter',
    youtube = 'youtube',
}

const typeToContentMap: {
    [key in GenericModalUrlType]: {
        title: string;
        description: string;
        placeholder: string;
        icon: keyof typeof icons;
    };
} = {
    [GenericModalUrlType.twitter]: {
        title: 'Add tweet',
        description: 'Please, insert tweet url below',
        placeholder: 'Paste tweet link here',
        icon: 'Twitter',
    },
    [GenericModalUrlType.youtube]: {
        title: 'Add Youtube video',
        description: 'Please, insert youtube video url below',
        placeholder: 'Paste video link here',
        icon: 'Youtube',
    },
};

type FormData = {
    url: string;
};

const GenericModal = ({ isOpen, onClose, type, editor }: GenericModalProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit: SubmitHandler<FormData> = async ({ url }) => {
        switch (type) {
            case GenericModalUrlType.twitter:
                editor.commands.insertTweet(url);
                break;
            case GenericModalUrlType.youtube:
                editor.commands.setYoutubeVideo({
                    src: url,
                });
                break;
        }
        onClose(false);
    };

    const { title, description, placeholder, icon } =
        typeToContentMap?.[type] ?? {};

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={'p-6 w-1/3'}>
                <DialogHeader>
                    <DialogTitle className={'flex items-center gap-x-2'}>
                        <span>{title}️</span>
                        <Icon name={icon} />
                    </DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className={'flex flex-col gap-y-7'}>
                    <Input
                        placeholder={placeholder}
                        register={register}
                        name={'url'}
                        isRequired={true}
                        rules={{ ...urlValidation }}
                        error={errors.url}
                    />
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                    >
                        Submit
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default GenericModal;
