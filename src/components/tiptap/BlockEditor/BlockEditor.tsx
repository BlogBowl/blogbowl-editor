import { EditorContent } from '@tiptap/react';
import { useMemo, useRef } from 'react';
import { LinkMenu } from '@/components/tiptap/menus';
import { useBlockEditor } from '@/hooks/useBlockEditor';

import '@/styles/index.css';

import { Sidebar } from '@/components/tiptap/Sidebar';
import { EditorContext } from '@/context/EditorContext';
import ImageBlockMenu from '@/extensions/ImageBlock/components/ImageBlockMenu';
import { ColumnsMenu } from '@/extensions/MultiColumn/menus';
import { TableColumnMenu, TableRowMenu } from '@/extensions/Table/menus';
import { TiptapProps } from './types';
import { EditorHeader } from './components/EditorHeader';
import { TextMenu } from '../menus/TextMenu';
import { ContentItemMenu } from '../menus/ContentItemMenu';
import GenericModal from '@/components/modal/GenericModal.tsx';

export const BlockEditor = ({ provider }: TiptapProps) => {
    const menuContainerRef = useRef(null);
    const editorRef = useRef<HTMLDivElement | null>(null);

    const {
        editor,
        characterCount,
        leftSidebar,
        postTitle,
        setPostTitle,
        debounceUpdateTitle,
        syncState,
        setSyncState,
        page,
    } = useBlockEditor({
        provider,
    });

    const providerValue = useMemo(() => {
        return {};
    }, []);

    const isModalOpen = editor?.storage?.slashCommand?.isModalOpen;
    const modalType = editor?.storage?.slashCommand?.modalType;

    if (!editor) {
        return null;
    }

    return (
        <>
            <EditorContext.Provider value={providerValue}>
                <div className="flex h-full" ref={menuContainerRef}>
                    <div className="relative flex flex-col flex-1 h-full overflow-hidden">
                        <EditorHeader
                            characters={characterCount.characters()}
                            words={characterCount.words()}
                            isSidebarOpen={leftSidebar.isOpen}
                            toggleSidebar={leftSidebar.toggle}
                            syncState={syncState}
                            editor={editor}
                            backPath={`/pages/${page.name_slug}`}
                        />
                        <div className={'px-24 py-10 border-b'}>
                            <textarea
                                className="w-full px-5 h-auto py-2 text-4xl font-bold resize-none border-0 outline-none focus:outline-none focus:ring-0 focus:ring-offset-0"
                                placeholder={
                                    'Click here to enter title of the post...'
                                }
                                value={postTitle ?? ''}
                                onChange={e => {
                                    setSyncState('syncing');
                                    const value = e.target.value;
                                    setPostTitle(value);
                                    debounceUpdateTitle(value);
                                }}
                                rows={1}
                                onInput={e => {
                                    //@ts-expect-error IDK
                                    e.target.style.height = 'auto';
                                    //@ts-expect-error IDK
                                    e.target.style.height =
                                        //@ts-expect-error IDK
                                        e.target.scrollHeight + 'px';
                                }}
                            />
                        </div>
                        <EditorContent
                            editor={editor}
                            ref={editorRef}
                            className="flex-1 overflow-y-auto"
                        />
                        <ContentItemMenu editor={editor} />
                        <LinkMenu editor={editor} appendTo={menuContainerRef} />
                        <TextMenu editor={editor} />
                        <ColumnsMenu
                            editor={editor}
                            appendTo={menuContainerRef}
                        />
                        <TableRowMenu
                            editor={editor}
                            appendTo={menuContainerRef}
                        />
                        <TableColumnMenu
                            editor={editor}
                            appendTo={menuContainerRef}
                        />
                        <ImageBlockMenu
                            editor={editor}
                            appendTo={menuContainerRef}
                        />
                    </div>
                    <Sidebar
                        isOpen={leftSidebar.isOpen}
                        onClose={leftSidebar.close}
                        editor={editor}
                    />
                </div>
            </EditorContext.Provider>
            <GenericModal
                isOpen={isModalOpen}
                onClose={() => editor.commands.closeGenericModal()}
                type={modalType}
                editor={editor}
            />
        </>
    );
};

export default BlockEditor;
