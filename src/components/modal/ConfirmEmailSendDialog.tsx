import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { SubmitHandler, useForm } from 'react-hook-form';
import RadioGroupBadge, {
    RadioOption,
} from '@/components/core/RadioGroupBadge.tsx';
import { Icon } from '@/components/tiptap/ui/Icon.tsx';
import DateInput from '@/components/core/DateInput.tsx';
import Input from '@/components/core/Input.tsx';
import dayjs from 'dayjs';
import { getUtcDateTime } from '@/lib/utils/dates.ts';
import { useMainContext } from '@/App.tsx';
import { request } from '@/lib/request.ts';
import api from '@/lib/api.ts';
import toast from 'react-hot-toast';
import { API } from '@/types.ts';

type ConfirmEmailSendDialog = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
};

type ConfirmEmailSendForm = {
    sendType: 'sendNow' | 'schedule';
    scheduledAt: Date;
    scheduledAtTime: string;
};

const SEND_OPTIONS: RadioOption[] = [
    {
        label: 'Send it now',
        value: 'sendNow',
    },
    {
        label: 'Schedule for later',
        value: 'schedule',
    },
];

const ConfirmEmailSendOverlay = ({
    isOpen,
    setIsOpen,
}: ConfirmEmailSendDialog) => {
    const {
        subscribersCount,
        email,
        updateEmail,
        settingsFilled,
        newsletter,
        isPaying,
    } = useMainContext();

    const [scheduledDate, setScheduledDate] = useState<Date>();
    const [isLoading, setIsLoading] = useState(false);

    const {
        handleSubmit,
        control,
        formState: { errors },
        register,
        watch,
    } = useForm<ConfirmEmailSendForm>({
        defaultValues: {
            sendType: 'sendNow',
            scheduledAt: dayjs().toDate(),
            scheduledAtTime: dayjs().add(10, 'minutes').format('HH:mm'),
        },
    });

    const watchValues = watch();
    const sendTypeWatch = watchValues.sendType;
    const isScheduled = sendTypeWatch === 'schedule';

    useEffect(() => {
        if (watchValues.scheduledAt && watchValues.scheduledAtTime) {
            setScheduledDate(
                getUtcDateTime(
                    watchValues.scheduledAt,
                    watchValues.scheduledAtTime,
                ),
            );
        }
    }, [watchValues.scheduledAt, watchValues.scheduledAtTime]);

    const onSubmit: SubmitHandler<ConfirmEmailSendForm> = async ({
        sendType,
        scheduledAtTime,
        scheduledAt,
    }) => {
        setIsLoading(true);
        const shouldBeScheduled = sendType === 'schedule';

        const [data, error] = await request(
            api.post<API.Email>(
                `/newsletters/${newsletter.id}/emails/${email!.id}/send`,
                {
                    scheduled_at: shouldBeScheduled
                        ? getUtcDateTime(scheduledAt, scheduledAtTime)
                        : null,
                },
            ),
        );

        setIsLoading(false);

        if (error) {
            toast.error(
                `There was an error sending message: ${error?.data?.error}`,
            );
            return;
        }

        updateEmail(data!);

        toast.success(
            shouldBeScheduled
                ? 'Newsletter is scheduled'
                : "We're starting to send your newsletter",
        );

        setIsOpen(false);
    };

    const onClose = () => setIsOpen(false);

    const buttonLabel = isScheduled ? 'Schedule E-mail' : 'Send E-mail now';

    const noSubscribers = !subscribersCount;

    const getWarningMessage = () => {
        if (!isPaying) {
            return (
                <p className={'text-error text-xs'}>
                    Upgrade your plan to unlock newsletter features.{' '}
                    <a href={`/settings/billing/edit`} className={'underline'}>
                        Click here to upgrade plan!
                    </a>
                </p>
            );
        }
        if (!settingsFilled) {
            return (
                <p className={'text-error text-xs'}>
                    Before sending the newsletter, please complete the required
                    settings.{' '}
                    <a
                        href={`/newsletters/${newsletter.name_slug}/settings/newsletter/domain/edit`}
                        className={'underline'}
                    >
                        Click here to fill them in.
                    </a>
                </p>
            );
        }
        if (noSubscribers) {
            return (
                <p className={'text-error text-xs'}>
                    Since you don't have any subscribers yet, there is no one to
                    send your newsletter to.{' '}
                    <a
                        href={`/newsletters/${newsletter.name_slug}/subscribers`}
                        className={'underline'}
                    >
                        To manage your subscribers click here.
                    </a>
                </p>
            );
        }
        return (
            <p className={'text-gray-500 text-xs'}>
                {isScheduled
                    ? 'You can cancel scheduled E-mail before the execution date.'
                    : `By clicking "${buttonLabel}", we will immediately send the newsletter to ALL subscribers. This action cannot be undone.`}
            </p>
        );
    };

    const warningMessage = getWarningMessage();

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className={'py-16 w-2/3'} withClose={false}>
                <div className={'flex flex-col w-3/4 mx-auto'}>
                    <p className={'text-4xl font-bold'}>
                        Review & send newsletter 📬
                    </p>
                    <p className={'text-gray-600'}>
                        One last look before sending. Decide your distribution
                        method: immediate send or planned delivery.
                    </p>

                    <div className={'my-10'}>
                        <div className={'py-5 border-y flex flex-col gap-y-4'}>
                            <div className={'flex items-center gap-x-2'}>
                                <Icon name="Users" className={'size-4'} />
                                <p className={'text-lg font-medium'}>
                                    All {subscribersCount} subscribers
                                </p>
                            </div>
                        </div>
                        <div className={'py-5 border-b flex flex-col gap-y-4'}>
                            <div className={'flex items-center gap-x-2'}>
                                <Icon name="Clock" className={'size-4'} />
                                <p className={'text-lg font-medium'}>
                                    {isScheduled
                                        ? dayjs(scheduledDate).fromNow()
                                        : 'Right now'}
                                </p>
                            </div>
                            <div className={'flex items-center gap-x-2'}>
                                <RadioGroupBadge
                                    control={control}
                                    name={'sendType'}
                                    options={SEND_OPTIONS}
                                />
                                {isScheduled && (
                                    <>
                                        <div>
                                            <DateInput
                                                name={'scheduledAt'}
                                                control={control}
                                            />
                                        </div>
                                        <Input
                                            placeholder={'Time'}
                                            register={register}
                                            name={'scheduledAtTime'}
                                            type={'time'}
                                            className={'w-fit'}
                                            error={errors?.scheduledAtTime}
                                            isRequired
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={'flex items-center gap-x-5'}>
                        <Button
                            variant={'default'}
                            className={'w-fit flex items-center gap-x-4'}
                            onClick={handleSubmit(onSubmit)}
                            disabled={
                                noSubscribers || !settingsFilled || !isPaying
                            }
                            isLoading={isLoading}
                        >
                            <p>{buttonLabel}</p>
                            <Icon name={'Send'} />
                        </Button>
                        <Button
                            variant={'secondary'}
                            className={'w-fit flex items-center gap-x-4'}
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        {warningMessage}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
export default ConfirmEmailSendOverlay;
