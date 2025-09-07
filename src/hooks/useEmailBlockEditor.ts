import { Editor, EditorEvents, useEditor } from '@tiptap/react';
import { TiptapCollabProvider } from '@hocuspocus/provider';

import { ExtensionKit } from '@/extensions/extension-kit';
import { useSidebar } from './useSidebar';
import { useDebouncedCallback } from 'use-debounce';
import { useMainContext } from '@/App.tsx';
import api from '@/lib/api.ts';
import { request } from '@/lib/request.ts';
import { useRef, useState } from 'react';
import { API, SyncStateType } from '@/types.ts';
import toast from 'react-hot-toast';

declare global {
    interface Window {
        editor: Editor | null;
    }
}

export const useEmailBlockEditor = ({
    provider,
}: {
    provider?: TiptapCollabProvider | null | undefined;
}) => {
    const [syncState, setSyncState] = useState<SyncStateType>('synced');
    const leftSidebar = useSidebar();

    const { updateEmail, email, newsletter } = useMainContext();
    const [emailSubject, setEmailSubject] = useState(email?.subject);
    const emailIdRef = useRef(email?.id?.toString());

    const updatePath = (newSlug: string) => {
        const newPath = `/newsletters/${newsletter.name_slug}/newsletter_emails/${newSlug}/edit`;
        window.history.replaceState({}, '', newPath);
    };

    const upsertEmail = async (emailDto: Partial<API.Email>) => {
        if (!emailIdRef.current) {
            const [emailData, emailError] = await request<API.Email>(
                api.post(`/newsletters/${newsletter.id}/emails`, emailDto),
            );

            if (emailError) {
                setSyncState('error');
                toast.error('Failed to create post');
                return;
            }

            emailIdRef.current = emailData!.id.toString();
            updatePath(emailData!.slug);
            updateEmail(emailData!);
            setSyncState('synced');
            return emailData;
        }
        const [emailData, emailError] = await request<API.Email>(
            api.patch(
                `/newsletters/${newsletter.id}/emails/${emailIdRef.current}`,
                emailDto,
            ),
        );

        if (emailError) {
            setSyncState('error');
            toast.error('Failed to update email');
            return;
        }

        updatePath(emailData!.slug);
        updateEmail(emailData!);
        setSyncState('synced');
        return emailData;
    };

    const debounceUpdateTitle = useDebouncedCallback(
        async (subject: string) => {
            await upsertEmail({ subject });
        },
        500,
    );

    const debouncedOnUpdate = useDebouncedCallback(
        async ({ editor }: EditorEvents['update']) => {
            const content_html = editor.getHTML();
            const content_json = editor.getJSON();
            await upsertEmail({
                subject: emailSubject,
                content_html,
                content_json,
            });
        },
        1000,
    );

    const getUploadImagePath = async () => {
        if (!emailIdRef.current) {
            const newEmail = await upsertEmail({});
            if (!newEmail) {
                toast.error('Failed to create post');
                return;
            }
            emailIdRef.current = newEmail!.id!.toString();
        }
        return `/newsletters/${newsletter.id}/emails/${emailIdRef.current}/images`;
    };

    const editor = useEditor(
        {
            autofocus: true,
            onCreate: ({ editor }) => {
                if (editor.isEmpty && email?.content_json) {
                    editor.commands.setContent(email.content_json);
                }
            },
            onUpdate: props => {
                setSyncState('syncing');
                debouncedOnUpdate(props);
            },
            extensions: [...ExtensionKit({ provider, getUploadImagePath })],
            editorProps: {
                attributes: {
                    autocomplete: 'off',
                    autocorrect: 'off',
                    autocapitalize: 'off',
                    class: 'min-h-full',
                },
            },
        },
        [provider],
    );

    const characterCount = editor?.storage.characterCount || {
        characters: () => 0,
        words: () => 0,
    };

    window.editor = editor;

    return {
        editor,
        characterCount,
        leftSidebar,
        syncState,
        title: emailSubject,
        setTitle: setEmailSubject,
        debounceUpdateTitle,
        setSyncState,
    };
};
