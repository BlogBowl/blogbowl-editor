import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { SubmitHandler, useForm } from "react-hook-form";
import { Icon } from "@/components/tiptap/ui/Icon.tsx";
import DateInput from "@/components/core/DateInput.tsx";
import Input from "@/components/core/Input.tsx";
import dayjs from "dayjs";
import { getUtcDateTime } from "@/lib/utils/dates.ts";
import { useMainContext } from "@/App.tsx";
import { request } from "@/lib/request.ts";
import api from "@/lib/api.ts";
import toast from "react-hot-toast";
import { API } from "@/types.ts";

type ConfirmPublishingModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

type ConfirmPublishingForm = {
  scheduledAt: Date;
  scheduledAtTime: string;
};

const ConfirmPublishingModal = ({
  isOpen,
  setIsOpen,
}: ConfirmPublishingModalProps) => {
  const { post, updatePost, page } = useMainContext();

  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
    register,
    watch,
  } = useForm<ConfirmPublishingForm>({
    defaultValues: {
      scheduledAt: dayjs().toDate(),
      scheduledAtTime: dayjs().add(3, "hours").format("HH:mm"),
    },
  });

  const watchValues = watch();

  useEffect(() => {
    if (watchValues.scheduledAt && watchValues.scheduledAtTime) {
      setScheduledDate(
        getUtcDateTime(watchValues.scheduledAt, watchValues.scheduledAtTime),
      );
    }
  }, [watchValues.scheduledAt, watchValues.scheduledAtTime]);

  const onSubmit: SubmitHandler<ConfirmPublishingForm> = async ({
    scheduledAtTime,
    scheduledAt,
  }) => {
    setIsLoading(true);
    const [data, error] = await request(
      api.post<API.Post>(`/pages/${post.page_id}/posts/${post!.id}/publish`, {
        scheduled_at: getUtcDateTime(scheduledAt, scheduledAtTime),
      }),
    );

    setIsLoading(false);

    if (error) {
      toast.error(`There was an error scheduling post: ${error?.data?.error}`);
      return;
    }

    updatePost(data!);

    toast.success("Post is scheduled");

    setIsOpen(false);
  };

  const onClose = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={"py-16 w-1/2"} withClose={false}>
        <div className={"flex flex-col w-3/4 mx-auto"}>
          <p className={"text-4xl font-bold"}>Schedule Post Publication⏱️</p>
          <p className={"text-gray-600"}>
            Your post will go live at the time you selected. Ready to schedule
            it?
          </p>

          <div className={"my-10"}>
            <div className={"py-5 border-b flex flex-col gap-y-4"}>
              <div className={"flex items-center gap-x-2"}>
                <Icon name="Clock" className={"size-4"} />
                <p className={"text-lg font-medium"}>
                  {dayjs(scheduledDate).fromNow()}
                </p>
              </div>
              <div className={"flex items-center gap-x-2"}>
                <div>
                  <DateInput name={"scheduledAt"} control={control} />
                </div>
                <Input
                  placeholder={"Time"}
                  register={register}
                  name={"scheduledAtTime"}
                  type={"time"}
                  className={"w-fit"}
                  error={errors?.scheduledAtTime}
                  isRequired
                />
              </div>
            </div>
          </div>

          <div className={"flex items-center gap-x-5"}>
            <Button
              variant={"default"}
              className={"w-fit flex items-center gap-x-4"}
              onClick={handleSubmit(onSubmit)}
              isLoading={isLoading}
            >
              <p>Schedule Publish</p>
              <Icon name={"Check"} />
            </Button>
            <Button
              variant={"secondary"}
              className={"w-fit flex items-center gap-x-4"}
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default ConfirmPublishingModal;
