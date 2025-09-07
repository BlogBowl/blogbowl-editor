import { EditorContent } from '@tiptap/react';
import { useMemo, useRef, useState } from 'react';
import { LinkMenu } from '@/components/tiptap/menus';

import '@/styles/index.css';

import { EditorContext } from '@/context/EditorContext';
import ImageBlockMenu from '@/extensions/ImageBlock/components/ImageBlockMenu';
import { ColumnsMenu } from '@/extensions/MultiColumn/menus';
import { TableColumnMenu, TableRowMenu } from '@/extensions/Table/menus';
import { EditorHeader } from './components/EditorHeader';
import { TextMenu } from '../menus/TextMenu';
import { ContentItemMenu } from '../menus/ContentItemMenu';
import GenericModal from '@/components/modal/GenericModal.tsx';
import { TiptapCollabProvider } from '@hocuspocus/provider';
import { EmailSidebar } from '@/components/tiptap/Sidebar/EmailSidebar.tsx';
import { useEmailBlockEditor } from '@/hooks/useEmailBlockEditor.ts';
import ConfirmEmailSendOverlay from '@/components/modal/ConfirmEmailSendDialog.tsx';
import { EditorInfo } from '@/components/tiptap/BlockEditor/components/EditorInfo.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Icon } from '@/components/tiptap/ui/Icon.tsx';
import { useMainContext } from '@/App.tsx';
import { API } from '@/types.ts';
import dayjs from 'dayjs';
import { useUnscheduleEmail } from '@/hooks/api/useUnscheduleEmail.ts';
import toast from 'react-hot-toast';
import PreviewEmailDialog from '@/components/modal/PreviewEmailDialog.tsx';

const getAdditionalText = (email: API.Email) => {
    if (email?.status === 'scheduled') {
        const scheduledAt = email?.scheduled_at;
        return `This email is scheduled to be sent ${scheduledAt ? dayjs(email?.scheduled_at).fromNow() : ''}.\nYou can still make changes if needed.`;
    }
    if (email?.status === 'sent') {
        return 'This email has already been sent and cannot be edited';
    }
    return undefined;
};

export const EmailEditor = () => {
    const [provider] = useState<TiptapCollabProvider | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const menuContainerRef = useRef(null);
    const editorRef = useRef<HTMLDivElement | null>(null);

    const { email, newsletter, isPaying } = useMainContext();

    const {
        editor,
        characterCount,
        leftSidebar,
        title,
        setTitle,
        debounceUpdateTitle,
        syncState,
        setSyncState,
    } = useEmailBlockEditor({
        provider,
    });

    const providerValue = useMemo(() => {
        return {};
    }, []);

    const isModalOpen = editor?.storage?.slashCommand?.isModalOpen;
    const modalType = editor?.storage?.slashCommand?.modalType;

    const warningText = useMemo(() => getAdditionalText(email), [email]);

    const { unscheduleEmail, isLoading: isUnscheduling } = useUnscheduleEmail();

    const validateEmail = () => {
        if (!email?.subject || email.subject === '') {
            toast.error(
                'Please, set e-mail subject before previewing & sending e-mail!',
            );
            return false;
        }
        if (!email?.author_id) {
            toast.error(
                'Please, set author before previewing & sending e-mail!',
            );
            return false;
        }
        return true;
    };

    const onReviewClick = () => {
        if (!validateEmail()) {
            return;
        }
        setIsConfirmOpen(true);
    };

    const onPreviewClick = () => {
        if (!validateEmail()) {
            return;
        }
        setIsPreviewOpen(true);
    };

    const getButtons = () => {
        if (!editor) {
            return null;
        }
        if (email?.status === 'scheduled') {
            return (
                <>
                    <Button
                        size={'sm'}
                        variant={'outline'}
                        className={'flex items-center gap-x-2'}
                        disabled={editor.isEmpty}
                    >
                        <p className={'text-xs'}>Preview</p>
                        <Icon name={'ScanEye'} className={'size-3'} />
                    </Button>
                    <Button
                        size={'sm'}
                        className={'flex items-center gap-x-2'}
                        onClick={unscheduleEmail}
                        isLoading={isUnscheduling}
                        variant={'outline-error'}
                    >
                        <p className={'text-xs'}>Unschedule</p>
                        <Icon name={'TimerOff'} className={'size-3'} />
                    </Button>
                </>
            );
        }
        if (email?.status === 'draft') {
            return (
                <>
                    <Button
                        size={'sm'}
                        variant={'outline'}
                        className={'flex items-center gap-x-2'}
                        disabled={editor.isEmpty}
                        onClick={onPreviewClick}
                    >
                        <p className={'text-xs'}>Preview</p>
                        <Icon name={'ScanEye'} className={'size-3'} />
                    </Button>
                    <Button
                        size={'sm'}
                        className={'flex items-center gap-x-2'}
                        onClick={onReviewClick}
                        disabled={editor.isEmpty}
                    >
                        <p className={'text-xs'}>Review & send</p>
                        <Icon name={'Send'} className={'size-3'} />
                    </Button>
                </>
            );
        }
        if (email?.status === 'sent') {
            // TODO: As of now return null, maybe we'll have separate analytics screen
            return <div></div>;
            return (
                <Button size={'sm'} className={'flex items-center gap-x-2'}>
                    <p className={'text-xs'}>Analytics</p>
                    <Icon name={'AreaChart'} className={'size-3'} />
                </Button>
            );
        }
    };

    const buttons = useMemo(() => getButtons(), [email, !editor]);

    if (!editor) {
        return null;
    }

    return (
        <>
            <EditorContext.Provider value={providerValue}>
                <div className="flex h-full" ref={menuContainerRef}>
                    <div className="relative flex flex-col flex-1 h-full overflow-hidden">
                        <EditorHeader
                            isSidebarOpen={leftSidebar.isOpen}
                            toggleSidebar={leftSidebar.toggle}
                            syncState={syncState}
                            backPath={`/newsletters/${newsletter.name_slug}/newsletter_emails`}
                            buttons={buttons}
                            status={email?.status ?? 'Draft'}
                            warningText={warningText}
                        />
                        <div className={'px-24 py-10 border-b relative'}>
                            <div className={'absolute right-5 top-2'}>
                                <EditorInfo
                                    characters={characterCount.characters()}
                                    words={characterCount.words()}
                                    editor={editor}
                                    withHistory={false}
                                />
                            </div>
                            <textarea
                                className="w-full px-5 h-auto py-2 text-4xl font-bold resize-none border-0 outline-none focus:outline-none focus:ring-0 focus:ring-offset-0"
                                placeholder={
                                    'Click here to enter subject of the email...'
                                }
                                value={title ?? ''}
                                onChange={e => {
                                    setSyncState('syncing');
                                    const value = e.target.value;
                                    setTitle(value);
                                    debounceUpdateTitle(value);
                                }}
                                rows={1}
                                ref={textareaRef => {
                                    // Auto-resize on initial load/refresh
                                    if (textareaRef && title) {
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
                    <EmailSidebar
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
            <ConfirmEmailSendOverlay
                isOpen={isConfirmOpen}
                setIsOpen={setIsConfirmOpen}
            />
            <PreviewEmailDialog
                isOpen={isPreviewOpen}
                setIsOpen={setIsPreviewOpen}
                email={email}
                newsletter={newsletter}
                isPaying={isPaying}
            />
        </>
    );
};

export default EmailEditor;
