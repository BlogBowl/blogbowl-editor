import { EditorContent } from '@tiptap/react';
import { useMemo, useRef, useState } from 'react';
import { LinkMenu } from '@/components/tiptap/menus';
import { useBlockEditor } from '@/hooks/useBlockEditor';

import '@/styles/index.css';

import { Sidebar } from '@/components/tiptap/Sidebar';
import { EditorContext } from '@/context/EditorContext';
import ImageBlockMenu from '@/extensions/ImageBlock/components/ImageBlockMenu';
import { ColumnsMenu } from '@/extensions/MultiColumn/menus';
import { TableColumnMenu, TableRowMenu } from '@/extensions/Table/menus';
import { EditorHeader } from './components/EditorHeader';
import { TextMenu } from '../menus/TextMenu';
import { ContentItemMenu } from '../menus/ContentItemMenu';
import GenericModal from '@/components/modal/GenericModal.tsx';
import { TiptapCollabProvider } from '@hocuspocus/provider';
import { Button } from '@/components/ui/button.tsx';
import { Icon } from '@/components/tiptap/ui/Icon.tsx';
import { EditorInfo } from '@/components/tiptap/BlockEditor/components/EditorInfo.tsx';
import { useMainContext } from '@/App.tsx';
import { usePublishPost } from '@/hooks/api/usePublishPost.ts';
import { useShareLastRevision } from '@/hooks/api/useShareLastRevision.ts';
import { Globe } from 'lucide-react';

export const PostEditor = () => {
    const [provider] = useState<TiptapCollabProvider | null>(null);

    const menuContainerRef = useRef(null);
    const editorRef = useRef<HTMLDivElement | null>(null);

    const { post, revision } = useMainContext();

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

    const { isLoading: isPublishing, publishPost } = usePublishPost();
    const { isLoading: isSharing, shareLastRevision } = useShareLastRevision();

    const hasChanges = revision?.kind !== 'history';

    if (!editor) {
        return null;
    }

    const isPublished = post.status === 'published';

    const buttons = (
        <>
            {isPublished && (
                <Button
                    size={'sm'}
                    variant={'ghost'}
                    href={`https://${page.domain}/posts/${post.slug}`}
                    //@ts-expect-error open in new tab - make better types in future
                    target={'_blank'}
                >
                    <Globe className="size-4 text-gray-500" />
                </Button>
            )}
            <Button
                size={'sm'}
                variant={'outline'}
                className={'flex items-center gap-x-2'}
                disabled={editor.isEmpty || isSharing}
                isLoading={isSharing}
                onClick={shareLastRevision}
            >
                <p className={'text-xs'}>Preview</p>
                <Icon name={'Send'} className={'size-3'} />
            </Button>
            <Button
                size={'sm'}
                className={'flex items-center gap-x-2'}
                disabled={editor.isEmpty || !hasChanges || isPublishing}
                onClick={publishPost}
                isLoading={isPublishing}
            >
                <p className={'text-xs'}>
                    {isPublished ? 'Update post' : 'Publish post'}
                </p>
                <Icon name={'Send'} className={'size-3'} />
            </Button>
        </>
    );

    return (
        <>
            <EditorContext.Provider value={providerValue}>
                <div className="flex h-full" ref={menuContainerRef}>
                    <div className="relative flex flex-col flex-1 h-full overflow-hidden">
                        <EditorHeader
                            isSidebarOpen={leftSidebar.isOpen}
                            toggleSidebar={leftSidebar.toggle}
                            syncState={syncState}
                            backPath={`/pages/${page.name_slug}`}
                            buttons={buttons}
                            status={post?.status ?? 'Draft'}
                        />
                        <div
                            className={'px-24 pt-10 min-h-32 border-b relative'}
                        >
                            <div className={'absolute right-5 top-2'}>
                                <EditorInfo
                                    characters={characterCount.characters()}
                                    words={characterCount.words()}
                                    editor={editor}
                                    withHistory={true}
                                />
                            </div>
                            <textarea
                                className="w-full px-5 h-auto py-2 text-4xl font-bold resize border-0 outline-none focus:outline-none focus:ring-0 focus:ring-offset-0"
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
                                ref={textareaRef => {
                                    // Auto-resize on initial load/refresh
                                    if (textareaRef && postTitle) {
                                        textareaRef.style.height = 'auto';
                                        textareaRef.style.height =
                                            Math.min(
                                                textareaRef.scrollHeight,
                                                90,
                                            ) + 'px';
                                    }
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

export default PostEditor;
