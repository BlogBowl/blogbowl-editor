import { memo, useState } from 'react';
import { Icon } from '@/components/tiptap/ui/Icon.tsx';
import Pressable from '@/components/core/Pressable.tsx';
import { Editor } from '@tiptap/core';
import { HistoryModal } from '@/components/modal/HistoryModal.tsx';

export type EditorInfoProps = {
    characters: number;
    words: number;
    editor: Editor | undefined;
    withHistory?: boolean;
};

export const EditorInfo = memo(
    ({ characters, words, editor, withHistory = true }: EditorInfoProps) => {
        const [historyOpen, setHistoryOpened] = useState(false);

        return (
            <>
                <div className="flex items-center justify-between">
                    <div className=""></div>
                    <div className={'flex flex-row items-center'}>
                        <div
                            className={
                                'flex flex-row items-center mr-5 gap-x-1'
                            }
                        >
                            <Pressable
                                tooltip={'Undo'}
                                onPress={() => editor?.commands?.undo()}
                            >
                                <Icon
                                    name={'Undo2'}
                                    className={'text-gray-500'}
                                />
                            </Pressable>
                            <Pressable
                                tooltip={'Redo'}
                                onPress={() => editor?.commands?.redo()}
                            >
                                <Icon
                                    name={'Redo2'}
                                    className={'text-gray-500'}
                                />
                            </Pressable>
                        </div>
                        {withHistory && (
                            <div className={'mr-5'}>
                                <Pressable
                                    tooltip={'History'}
                                    onPress={() => setHistoryOpened(true)}
                                >
                                    <Icon
                                        name={'History'}
                                        className={'text-gray-500'}
                                    />
                                </Pressable>
                            </div>
                        )}
                        <div className="flex flex-col justify-center text-right dark:border-neutral-800">
                            <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                {words} {words === 1 ? 'word' : 'words'}
                            </div>
                            <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                {characters}{' '}
                                {characters === 1 ? 'character' : 'characters'}
                            </div>
                        </div>
                    </div>
                </div>
                <HistoryModal
                    open={historyOpen}
                    setOpen={setHistoryOpened}
                    editor={editor}
                />
            </>
        );
    },
);

EditorInfo.displayName = 'EditorInfo';
