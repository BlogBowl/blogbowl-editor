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

export const DEFAULT_TITLE = 'My new post';

export const useBlockEditor = ({
    provider,
}: {
    provider?: TiptapCollabProvider | null | undefined;
}) => {
    const [syncState, setSyncState] = useState<SyncStateType>('synced');
    const leftSidebar = useSidebar();

    const { updatePost, updateRevision, post, revision, page } =
        useMainContext();
    const [postTitle, setPostTitle] = useState(revision?.title);
    const postIdRef = useRef(post?.id?.toString());
    const isPristineRef = useRef(true);

    const updatePath = (newSlug: string) => {
        const newPath = `/pages/${page.name_slug}/posts/${newSlug}/edit`;
        window.history.replaceState({}, '', newPath);
    };

    const upsertRevision = async (revisionDto: Partial<API.Revision>) => {
        if (isPristineRef.current) {
            isPristineRef.current = false;

            const [data, error] = await request<API.Revision>(
                api.post(
                    `/pages/${post.page_id}/posts/${postIdRef.current}/revisions`,
                    {
                        ...revisionDto,
                    },
                ),
            );

            if (error) {
                setSyncState('error');
                toast.error('Failed to create revision');
                return;
            }

            updateRevision(data!);
            setSyncState('synced');
            return data ?? undefined;
        }

        const [data, error] = await request<API.Revision>(
            api.patch(
                `/pages/${post.page_id}/posts/${postIdRef.current}/revisions/last`,
                {
                    ...revisionDto,
                },
            ),
        );

        if (error) {
            setSyncState('error');
            toast.error('Failed to udpate revision');
            return;
        }

        updateRevision(data!);
        setSyncState('synced');
        return data ?? undefined;
    };

    const upsertPost = async (postDto: Partial<API.Post>) => {
        const [postData, postError] = await request<API.Post>(
            api.post(`/pages/${post.page_id}/posts`, postDto),
        );

        if (postError) {
            setSyncState('error');
            toast.error('Failed to create post');
            return;
        }

        const [revisionData, revisionError] = await request<API.Revision>(
            api.post(`/pages/${post.page_id}/posts/${postData!.id}/revisions`),
        );

        if (revisionError) {
            setSyncState('error');
            toast.error('Failed to create post [revision]');
            return;
        }

        postIdRef.current = postData!.id.toString();
        updatePath(postData!.slug);
        updatePost(postData!);
        updateRevision(revisionData!);
        setSyncState('synced');
        return postData ?? undefined;
    };

    const debounceUpdateTitle = useDebouncedCallback(async (title: string) => {
        if (!postIdRef.current) {
            await upsertPost({ title });
            return;
        }
        await upsertRevision({ title });
    }, 500);

    const debouncedOnUpdate = useDebouncedCallback(
        async ({ editor }: EditorEvents['update']) => {
            const content_html = editor.getHTML();
            const content_json = editor.getJSON();
            const title = postTitle ?? DEFAULT_TITLE;
            if (!postIdRef.current) {
                await upsertPost({ title });
            }
            await upsertRevision({ content_json, content_html, title });
        },
        1000,
    );

    const getUploadImagePath = async () => {
        let postId = post?.id?.toString();
        if (!postId) {
            const newPost = await upsertPost({ title: DEFAULT_TITLE });
            if (!newPost) {
                toast.error('Failed to create post');
                return;
            }
            postId = newPost!.id!.toString();
        }
        return `/pages/${post.page_id}/posts/${postId}/images`;
    };

    const editor = useEditor(
        {
            autofocus: true,
            onCreate: ({ editor }) => {
                if (editor.isEmpty && revision?.content_json) {
                    editor.commands.setContent(revision.content_json);
                }
            },
            onUpdate: props => {
                setSyncState('syncing');
                debouncedOnUpdate(props);
            },
            extensions: [
                ...ExtensionKit({
                    provider,
                    getUploadImagePath,
                }),
            ],
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
        postTitle,
        setPostTitle,
        debounceUpdateTitle,
        setSyncState,
        page,
        post,
    };
};
