'use client';

import React, { useCallback, useState } from 'react';
import { Icon } from '@/components/tiptap/ui/Icon.tsx';
import { Label } from '@/components/ui/label.tsx';
import Pressable from '@/components/core/Pressable.tsx';
import {
    useDropZone,
    useFileUpload,
} from '@/extensions/ImageUpload/view/hooks.ts';
import { cn } from '@/lib/utils';
import {
    FieldError,
    FieldValues,
    Path,
    UseFormClearErrors,
    UseFormRegister,
    UseFormSetValue,
} from 'react-hook-form';

type ImageUploadProps<V extends FieldValues> = {
    register: UseFormRegister<V>;
    name: Path<V>;
    setValue: UseFormSetValue<V>;
    currentImage: FileList | undefined;
    label: string;
    error?: FieldError;
    clearErrors: UseFormClearErrors<V>;
    defaultImage: string | undefined;
};

const getImageUrl = (fileList: FileList) => {
    if (!fileList?.length) {
        return;
    }

    const file = fileList[0];

    return URL.createObjectURL(file);
};

const ImageUploadComponent = ({
    register,
    name,
    label = 'File',
    isRequired = false,
    error,
    currentImage,
    setValue,
    clearErrors,
    defaultImage,
}: ImageUploadProps) => {
    const [isHovering, setIsHovering] = useState<boolean>(false);

    const require = {
        value: isRequired!,
        message: '* This field is required',
    };

    const { ref: registerRef, ...rest } = register(name, {
        required: require,
    });

    const imageUrl = getImageUrl(currentImage);

    const removeSelectedImage = async () => {
        setValue(name, null);
    };

    const handleImageUpload = useCallback(async (fileList: FileList) => {
        if (!fileList) return;
        clearErrors(name);
        setValue(name, fileList);
    }, []);

    const { handleUploadClick, ref } = useFileUpload();
    const { draggedInside, onDrop, onDragEnter, onDragLeave } = useDropZone({
        uploader: handleImageUpload,
    });

    const isImageUploaded = !!imageUrl || defaultImage;

    const isError = !!error;

    return (
        <div>
            <div className={'flex flex-row items-center justify-between'}>
                <Label className={'font-medium text-sm'} htmlFor={name}>
                    {label}
                </Label>
                {isImageUploaded && (
                    <>
                        <Pressable
                            onPress={removeSelectedImage}
                            tooltip={'Delete image'}
                        >
                            <Icon name={'ImageOff'} />
                        </Pressable>
                    </>
                )}
            </div>
            <div className={'mt-1'} />

            <div className="space-y-3 h-40">
                <div className="h-full">
                    <div
                        className={cn(
                            'relative flex flex-col items-center justify-center p-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 w-full visually-hidden-focusable h-full',
                            draggedInside &&
                                'border-input-focus bg-primary-100',
                            isError && 'border-error bg-red-50',
                        )}
                        onClick={handleUploadClick}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        onDrop={event => {
                            event.preventDefault();
                            event.stopPropagation();
                            onDrop(event);
                        }}
                        onDragOver={event => {
                            event.preventDefault();
                            event.stopPropagation();
                            onDragEnter();
                        }}
                        onDragLeave={onDragLeave}
                        contentEditable={false}
                    >
                        {!isImageUploaded && (
                            <div className="text-center">
                                <div className="border p-2 rounded-md max-w-min mx-auto">
                                    <Icon name={'CloudUpload'} />
                                </div>

                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">
                                        {draggedInside
                                            ? 'Drop image to upload'
                                            : 'Drag an image'}
                                    </span>
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-400">
                                    Once you drop an image it will be
                                    automatically uploaded
                                </p>
                            </div>
                        )}

                        {isImageUploaded && (
                            <div className="text-center absolute right-0 left-0 top-0 bottom-0 hover:opacity-50 p-px rounded-lg">
                                <img
                                    src={imageUrl ?? defaultImage}
                                    className="w-full object-cover opacity-70 h-full rounded-md"
                                    alt="uploaded image"
                                />
                                {isHovering && (
                                    <div className="absolute inset-0 bg-slate-400 bg-opacity-50 flex items-center justify-center rounded-md p-px">
                                        <p className="text-white text-center">
                                            <Icon
                                                name={'ImageUp'}
                                                className="mx-auto mb-2"
                                            />
                                            Click or drag to change image
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <input
                        ref={event => {
                            registerRef(event);
                            ref.current = event;
                        }}
                        {...rest}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,.gif"
                        className="hidden"
                    />
                </div>
            </div>
            {isError && !!error?.message && (
                <p
                    style={{ fontSize: '12px' }}
                    className={'text-error mt-0.5 absolute'}
                >
                    {error.message}
                </p>
            )}
        </div>
    );
};

export default ImageUploadComponent;
