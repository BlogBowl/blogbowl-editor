import { DragEvent, useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { API } from '@/lib/api';
import { useMainContext } from '@/App.tsx';

export const useUploader = ({
    onUpload,
}: {
    onUpload: (url: string) => void;
}) => {
    const [loading, setLoading] = useState(false);
    const { post, email, type, newsletter } = useMainContext();

    const uploadFile = useCallback(
        async (file: File) => {
            setLoading(true);
            try {
                const path =
                    type === 'post'
                        ? `/pages/${post.page_id}/posts/${post.id}/images`
                        : `/newsletters/${newsletter.id}/emails/${email.id}/images`;
                const url = await API.uploadImage(file, path);

                if (!url) {
                    return;
                }

                onUpload(url);
            } catch (errPayload: any) {
                const error =
                    errPayload?.response?.data?.error || 'Something went wrong';
                toast.error(error);
            }
            setLoading(false);
        },
        [onUpload],
    );

    return { loading, uploadFile };
};

export const useFileUpload = () => {
    const fileInput = useRef<HTMLInputElement>(null);

    const handleUploadClick = useCallback(() => {
        fileInput.current?.click();
    }, []);

    return { ref: fileInput, handleUploadClick };
};

export const useDropZone = ({
    uploader,
}: {
    uploader: (file: FileList) => void;
}) => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [draggedInside, setDraggedInside] = useState<boolean>(false);

    useEffect(() => {
        const dragStartHandler = () => {
            setIsDragging(true);
        };

        const dragEndHandler = () => {
            setIsDragging(false);
        };

        document.body.addEventListener('dragstart', dragStartHandler);
        document.body.addEventListener('dragend', dragEndHandler);

        return () => {
            document.body.removeEventListener('dragstart', dragStartHandler);
            document.body.removeEventListener('dragend', dragEndHandler);
        };
    }, []);

    const onDrop = useCallback(
        (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setDraggedInside(false);
            if (e.dataTransfer.files.length === 0) {
                return;
            }

            const fileList = e.dataTransfer.files;

            if (!fileList) {
                return;
            }

            return uploader(fileList);
        },
        [uploader],
    );

    const onDragEnter = () => {
        setDraggedInside(true);
    };

    const onDragLeave = () => {
        setDraggedInside(false);
    };

    return { isDragging, draggedInside, onDragEnter, onDragLeave, onDrop };
};
