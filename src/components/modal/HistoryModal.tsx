import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { formatDateToHistory } from '@/lib/utils/dates.ts';
import Modal2ColumnUI from '@/components/modal/Modal2ColumnUI.tsx';
import { Editor } from '@tiptap/core';
import { useGetRevisions } from '@/hooks/api/useGetRevisions.ts';
import { API } from '@/types.ts';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton.tsx';

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);

type HistoryModalProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    editor: Editor | undefined;
};

export function HistoryModal({ open, setOpen }: HistoryModalProps) {
    const { data, isLoading } = useGetRevisions();
    const [selectedRevision, setSelectedRevision] = useState<API.Revision>();

    useEffect(() => {
        if ((data?.length ?? 0) > 0) {
            setSelectedRevision(data![0]);
        }
    }, [data]);

    const onClose = () => {
        setOpen(false);
    };

    const recentSavings = (
        <div className={''}>
            <div
                // TODO: Remove static height
                className={
                    'flex flex-col gap-y-3 py-5 px-2 overflow-y-scroll h-[600px]'
                }
            >
                {isLoading
                    ? new Array(4)
                          .fill(0)
                          .map((_, index) => (
                              <Skeleton
                                  key={`skeleton-revision-${index}`}
                                  className={'w-[300px] h-20'}
                              />
                          ))
                    : data?.map((revision, index) => (
                          <HistoryModal.HistoryItem
                              key={`post-revision-${index}`}
                              onClick={() => setSelectedRevision(revision)}
                              isActive={selectedRevision?.id === revision.id}
                              {...revision}
                          />
                      ))}
            </div>
            <div
                className={
                    'flex justify-end gap-x-2 border-t px-2 pt-4 absolute bottom-4 w-full'
                }
            >
                <Button
                    type="submit"
                    className={'w-fit'}
                    variant={'secondary'}
                    size={'sm'}
                    isLoading={isLoading}
                    onClick={onClose}
                >
                    Close
                </Button>
                <Button
                    type="submit"
                    className={'w-fit'}
                    variant={'default'}
                    size={'sm'}
                    isLoading={isLoading}
                    disabled={!selectedRevision}
                    // onClick={handleSubmit(onSubmit)}
                >
                    Set selected revision
                </Button>
            </div>
        </div>
    );

    return (
        <Modal2ColumnUI
            open={open}
            setOpen={setOpen}
            column2Children={recentSavings}
            dialogContentClassName={'w-[80%] h-[90%] flex'}
            column2Title={'Version history'}
        >
            {!!selectedRevision ? (
                <div className={'h-full w-full'}>
                    <p className={'font-bold text-lg'}>
                        {selectedRevision?.title}
                    </p>
                    <div
                        className="flex flex-col gap-y-4 p-10 overflow-y-scroll h-[700px]"
                        dangerouslySetInnerHTML={{
                            __html: selectedRevision?.content_html,
                        }}
                    />
                </div>
            ) : (
                <Skeleton className="w-full h-full rounded-lg flex flex-col items-center justify-center ">
                    <p>Loading revision...</p>
                </Skeleton>
            )}
        </Modal2ColumnUI>
    );
}

HistoryModal.HistoryItem = ({
    updated_at,
    onClick,
    isActive,
}: API.Revision & { onClick: () => void; isActive: boolean }) => {
    const { title, formattedDate } = formatDateToHistory(updated_at);

    return (
        <div
            className={cn(
                'flex flex-col gap-y-px p-2 rounded bg-primary-foreground w-[300px] hover:opacity-70 active:opacity-50 cursor-pointer',
                isActive ? 'bg-muted border border-primary' : '',
            )}
            onClick={onClick}
        >
            <p className={'text-sm font-bold'}>{title}</p>
            <p className={'text-xs text-gray truncate'}>{formattedDate}</p>
        </div>
    );
};
