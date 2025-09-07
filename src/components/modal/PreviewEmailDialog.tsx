import { Dialog, DialogContent } from '@/components/ui/dialog.tsx';
import { Dispatch, SetStateAction, useState } from 'react';
import DefaultEmail from '@/components/modal/DefaultEmail.tsx';
import { API } from '@/types.ts';
import { Button } from '@/components/ui/button.tsx';
import { Icon } from '@/components/tiptap/ui/Icon.tsx';
import { RegisterOptions, SubmitHandler, useForm } from 'react-hook-form';
import Input from '@/components/core/Input.tsx';
import { request } from '@/lib/request.ts';
import api from '@/lib/api.ts';
import toast from 'react-hot-toast';

type PreviewEmailDialogProps = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    email: API.Email;
    newsletter: API.Newsletter;
    isPaying: boolean;
};

const getEmailFrom = ({ sender_name, sender_email }: API.Email['settings']) => {
    if (!sender_name || !sender_email) {
        return {
            sender_name: 'Sample sender',
            sender_email: 'sample@email.com',
        };
    }
    return {
        sender_name,
        sender_email,
    };
};

type FormData = {
    emailAddress: string;
};

const emailValidation: RegisterOptions<FormData> = {
    pattern: {
        value: /\S+@\S+\.\S+/,
        message: 'Entered value does not match email format',
    },
};

const PreviewEmailDialog = ({
    isOpen,
    setIsOpen,
    email,
    newsletter,
    isPaying,
}: PreviewEmailDialogProps) => {
    const { sender_email, sender_name } = getEmailFrom(email.settings);
    const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);

    const { register, handleSubmit, reset } = useForm<FormData>();

    const onSubmit: SubmitHandler<FormData> = async ({ emailAddress }) => {
        setIsSendingTestEmail(true);
        const [_, error] = await request(
            api.post<API.Email>(
                `newsletters/${newsletter.id}/emails/${email!.id}/send/test`,
                {
                    emailAddress,
                },
            ),
        );
        setIsSendingTestEmail(false);
        reset({ emailAddress: '' });
        if (error) {
            toast.error('There was an error sending test e-mail!');
            return;
        }
        toast.success('Test e-mail was sucessfully sent!');
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className={'w-3/5 p-0 m-0 h-[85%] gap-0'}>
                <div className={'flex flex-col p-5 gap-y-1'}>
                    <div className={'flex items-center text-gray-500 text-sm'}>
                        <p className="w-[100px]">From:</p>
                        <p className={'font-bold'}>
                            {sender_name}
                            <span className="font-normal">{`<${sender_email}>`}</span>
                        </p>
                    </div>
                    <div className={'flex items-center text-gray-500 text-sm'}>
                        <p className="w-[100px]">To:</p>
                        <p className={'font-bold'}>
                            Peter Parker
                            <span className="font-normal">
                                {`<peter.parker@example.com>`}
                            </span>
                        </p>
                    </div>
                    <div className={'flex items-center text-gray-500 text-sm'}>
                        <p className="w-[100px]">Subject:</p>
                        <p className={'font-medium'}>{email.subject}</p>
                    </div>
                </div>
                <span className={'w-full h-px bg-gray-200'} />
                <div className={'overflow-scroll'}>
                    {email && (
                        <div className={'py-5'}>
                            <DefaultEmail {...email} />
                        </div>
                    )}
                </div>
                <div className={'w-full bg-gray-50 px-10 py-2 border-t'}>
                    {!isPaying && (
                        <p className={'text-error text-xs mb-2 text-right'}>
                            Upgrade your plan to unlock newsletter features.{' '}
                            <a
                                href={`/settings/billing/edit`}
                                className={'underline'}
                            >
                                Click here to upgrade plan!
                            </a>
                        </p>
                    )}
                    <div className={'flex items-center justify-between'}>
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            size={'sm'}
                        >
                            Close
                        </Button>
                        <div className={'flex items-center gap-x-2'}>
                            <Input
                                className="min-w-72"
                                placeholder={'Enter test email address...'}
                                register={register}
                                name={'emailAddress'}
                                isRequired={true}
                                rules={{ ...emailValidation }}
                            />
                            <Button
                                size={'sm'}
                                className={'flex items-center gap-x-2'}
                                onClick={handleSubmit(onSubmit)}
                                disabled={isSendingTestEmail || !isPaying}
                                isLoading={isSendingTestEmail}
                            >
                                <p className={'text-xs'}>Send test email</p>
                                <Icon name={'Send'} className={'size-3'} />
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PreviewEmailDialog;
