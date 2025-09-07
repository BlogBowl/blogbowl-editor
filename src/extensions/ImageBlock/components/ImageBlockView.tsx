import { cn } from '@/lib/utils';
import { Node } from '@tiptap/pm/model';
import { Editor, NodeViewWrapper } from '@tiptap/react';
import { useCallback, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface ImageBlockViewProps {
    editor: Editor;
    getPos: () => number;
    node: Node & {
        attrs: {
            src: string;
        };
    };
    updateAttributes: (attrs: Record<string, string>) => void;
}

export const ImageBlockView = (props: ImageBlockViewProps) => {
    const { editor, getPos, node, updateAttributes } = props;
    const imageWrapperRef = useRef<HTMLDivElement>(null);
    const { src, alt } = node.attrs;
    const [localAlt, setLocalAlt] = useState(alt);

    const wrapperClassName = cn(
        node.attrs.align === 'left' ? 'ml-0' : 'ml-auto',
        node.attrs.align === 'right' ? 'mr-0' : 'mr-auto',
        node.attrs.align === 'center' && 'mx-auto',
    );

    const onClick = useCallback(() => {
        editor.commands.setNodeSelection(getPos());
    }, [getPos, editor.commands]);

    const onAltChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const alt = event.target.value;
        setLocalAlt(alt);
        debounceUpdateTitle(alt);
    };

    const debounceUpdateTitle = useDebouncedCallback((alt: string) => {
        updateAttributes({ alt });
    }, 1000);

    return (
        <NodeViewWrapper>
            <div
                className={wrapperClassName}
                style={{ width: node.attrs.width }}
            >
                <div contentEditable={false} ref={imageWrapperRef}>
                    <img
                        className="block"
                        src={src}
                        alt={alt}
                        onClick={onClick}
                    />
                </div>
                <input
                    className={cn(
                        'flex h-8 w-full border-0 mt-2 text-center text-gray-700',
                    )}
                    placeholder={'Add alt to image...'}
                    onChange={onAltChange}
                    value={localAlt}
                    type="text"
                />
            </div>
        </NodeViewWrapper>
    );
};

export default ImageBlockView;
