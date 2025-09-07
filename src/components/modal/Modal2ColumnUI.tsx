import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog.tsx';
import Pressable from '@/components/core/Pressable.tsx';
import { X } from 'lucide-react';
import { Dispatch, ReactNode, SetStateAction } from 'react';

type Modal2ColumnUIProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    title?: string;
    description?: string;
    children: ReactNode;
    column2Children: ReactNode;
    dialogContentClassName?: string;
    column2Title?: string;
};

const Modal2ColumnUI = ({
    open,
    setOpen,
    title,
    description,
    children,
    column2Children,
    dialogContentClassName = '',
    column2Title,
}: Modal2ColumnUIProps) => {
    const onClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={val => setOpen(val)}>
            <DialogContent className={dialogContentClassName} withClose={false}>
                <div className={'flex divide-x w-full relative'}>
                    <div className={'p-6 flex-2 w-full'}>
                        <DialogHeader>
                            {!!title && <DialogTitle>{title}️</DialogTitle>}
                            {!!description && (
                                <DialogDescription>
                                    {description}
                                </DialogDescription>
                            )}
                        </DialogHeader>
                        {children}
                    </div>
                    <div className={'relative w-fit'}>
                        <Modal2ColumnUI.Close
                            onClose={onClose}
                            column2Title={column2Title}
                        />
                        {column2Children}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

Modal2ColumnUI.Close = ({
    onClose,
    column2Title,
}: {
    onClose: () => void;
} & Pick<Modal2ColumnUIProps, 'column2Title'>) => {
    return (
        <div className={'border-b flex items-center justify-between py-2 px-5'}>
            <p className={'text-nowrap font-bold text-sm'}>{column2Title}</p>
            <Pressable onPress={onClose}>
                <X className="h-4 w-4" />
            </Pressable>
        </div>
    );
};

export default Modal2ColumnUI;
