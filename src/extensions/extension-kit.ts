import { HocuspocusProvider } from '@hocuspocus/provider';

import {
    BlockquoteFigure,
    CharacterCount,
    Color,
    Column,
    Columns,
    Document,
    Dropcursor,
    Emoji,
    emojiSuggestion,
    Figcaption,
    FileHandler,
    Focus,
    FontFamily,
    FontSize,
    Heading,
    Highlight,
    HorizontalRule,
    ImageBlock,
    Link,
    Placeholder,
    Selection,
    SlashCommand,
    StarterKit,
    Subscript,
    Superscript,
    Table,
    TableCell,
    TableHeader,
    TableOfContents,
    TableRow,
    TaskItem,
    TaskList,
    TextAlign,
    TextStyle,
    TrailingNode,
    Typography,
    Underline,
} from '.';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { ImageUpload } from './ImageUpload';
import { TableOfContentsNode } from './TableOfContentsNode';
import { lowlight } from 'lowlight';
import { TableOfContentData } from '@tiptap-pro/extension-table-of-contents/dist/tiptap-pro/packages/extension-table-of-contents/src/types';
import slugify from 'slugify';
import { debounce } from 'next/dist/server/utils';
import { API as APIUtils } from '@/lib/api';
import toast from 'react-hot-toast';
import { TweetEmbed } from '@/extensions/TwitterEmbed/TwitterEmbed.tsx';
import { Youtube } from '@tiptap/extension-youtube';
import { ExtendedYoutube } from '@/extensions/ExtendedYoutube';

type ExtensionKitProps = {
    provider?: HocuspocusProvider | null;
    getUploadImagePath: () => Promise<string | undefined>;
};

const tableOfContentsUpdate = debounce(
    (data: TableOfContentData, _isCreate?: boolean) => {
        data.forEach(item => {
            const slugId = slugify(item.textContent, { lower: true });
            const tocId = item.node.attrs['data-toc-id'];
            item.id = slugId;
            item.dom.id = slugId;

            item.editor.state.doc.descendants(node => {
                if (
                    node.type.name === 'heading' &&
                    node.attrs['data-toc-id'] === tocId &&
                    node.attrs.id !== slugId
                ) {
                    item.editor.commands.updateAttributes('heading', {
                        id: slugId,
                    });
                    return false;
                }
                return false;
            });
        });
    },
    500,
);

export const ExtensionKit = ({
    provider,
    getUploadImagePath,
}: ExtensionKitProps) => {
    return [
        Document,
        Columns,
        TaskList,
        TaskItem.configure({
            nested: true,
        }),
        Column,
        Selection,
        HorizontalRule,
        TweetEmbed,
        ExtendedYoutube.configure({
            controls: false,
            nocookie: true,
        }),
        StarterKit.configure({
            document: false,
            dropcursor: false,
            heading: false,
            horizontalRule: false,
            blockquote: false,
            //@ts-expect-error IDK
            history: true,
            codeBlock: false,
        }),
        Heading.configure({
            levels: [2, 3, 4, 5, 6],
        }),
        CodeBlockLowlight.configure({
            lowlight,
            defaultLanguage: null,
        }),
        TextStyle,
        FontSize,
        FontFamily,
        Color,
        TrailingNode,
        Link.configure({
            openOnClick: false,
        }),
        Highlight.configure({ multicolor: true }),
        Underline,
        CharacterCount.configure({ limit: 50000 }),
        TableOfContents.configure({
            onUpdate: tableOfContentsUpdate,
        }),
        TableOfContentsNode,
        ImageUpload.configure({
            clientId: provider?.document?.clientID,
        }),
        ImageBlock,
        FileHandler.configure({
            allowedMimeTypes: [
                'image/png',
                'image/jpeg',
                'image/gif',
                'image/webp',
            ],
            onDrop: (currentEditor, files, pos) => {
                files.forEach(async file => {
                    const path = await getUploadImagePath();

                    if (!path) {
                        return;
                    }

                    const url = await APIUtils.uploadImage(file, path);

                    if (!url) {
                        toast.error('Failed to upload image');
                        return;
                    }

                    currentEditor
                        .chain()
                        .setImageBlockAt({ pos, src: url })
                        .focus()
                        .run();
                });
            },
            onPaste: (currentEditor, files) => {
                files.forEach(async file => {
                    const path = await getUploadImagePath();

                    if (!path) {
                        return;
                    }

                    const url = await APIUtils.uploadImage(file, path);

                    if (!url) {
                        toast.error('Failed to upload image');
                        return;
                    }

                    return currentEditor
                        .chain()
                        .setImageBlockAt({
                            pos: currentEditor.state.selection.anchor,
                            src: url,
                        })
                        .focus()
                        .run();
                });
            },
        }),
        Emoji.configure({
            enableEmoticons: true,
            suggestion: emojiSuggestion,
        }),
        TextAlign.extend({
            addKeyboardShortcuts() {
                return {};
            },
        }).configure({
            types: ['heading', 'paragraph'],
        }),
        Subscript,
        Superscript,
        Table,
        TableCell,
        TableHeader,
        TableRow,
        Typography,
        Placeholder.configure({
            includeChildren: true,
            showOnlyCurrent: false,
            placeholder: () => '',
        }),
        SlashCommand,
        Focus,
        Figcaption,
        BlockquoteFigure,
        Dropcursor.configure({
            width: 2,
            class: 'ProseMirror-dropcursor border-black',
        }),
    ];
};

export default ExtensionKit;
