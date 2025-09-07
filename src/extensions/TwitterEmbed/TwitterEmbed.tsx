import {
    nodePasteRule,
    NodeViewProps,
    NodeViewWrapper,
    ReactNodeViewRenderer,
} from '@tiptap/react';
import { mergeAttributes, Node } from '@tiptap/core';
import { memo, useEffect, useRef, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Button } from '@/components/tiptap/ui/Button.tsx';
import toast from 'react-hot-toast';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        TweetEmbed: {
            /**
             * Open a generic modal with a specific type
             */
            insertTweet: (url: string) => ReturnType;
        };
    }
}

declare global {
    interface Window {
        twttr: any;
    }
}

const useTwitter = () => {
    const [twitterScriptLoaded, setTwitterScriptLoaded] = useState(false);

    useEffect(() => {
        if (window.twttr) {
            setTwitterScriptLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
        script.setAttribute('async', 'true');
        script.onload = () => setTwitterScriptLoaded(true);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    return twitterScriptLoaded;
};

export const TweetComponent = memo(({ node, deleteNode }: NodeViewProps) => {
    const url = node.attrs.url;
    const tweetRef = useRef<HTMLDivElement>(null);
    const loaderRef = useRef<HTMLDivElement>(null);

    const twitterScriptLoaded = useTwitter();

    useEffect(() => {
        if (twitterScriptLoaded && tweetRef.current) {
            window?.twttr?.widgets
                ?.createTweet(url.split('/').pop(), tweetRef.current, {
                    conversation: 'none',
                    cards: 'hidden',
                    linkColor: '#cc0000',
                    theme: 'light',
                })
                .then((el: HTMLDivElement | null) => {
                    if (!el) {
                        toast.error(
                            "Could not fetch tweet. Check tweet's url, please!",
                        );
                        deleteNode();
                        return;
                    }
                })
                .catch(() => {
                    toast.error(
                        "Could not fetch tweet. Check tweet's url, please!",
                    );
                    deleteNode();
                })
                .finally(() => loaderRef.current!.remove());
        }
    }, [url, twitterScriptLoaded]);

    return (
        <NodeViewWrapper
            key={`twitter-tweet-${url}`}
            className="twitter-react-component relative"
        >
            <div
                ref={tweetRef}
                className={
                    'w-full rounded justify-center flex items-center min-h-60'
                }
            >
                <span
                    className="absolute flex items-center justify-center w-full h-full border border-dashed"
                    data-dnt="true"
                    ref={loaderRef}
                >
                    <Skeleton className="w-[90%] h-[90%] rounded-lg flex flex-col items-center justify-center ">
                        <p className={'font-bold text-gray-500 mr-2'}>
                            Tweet is being loaded...
                        </p>
                        <p className={'text-gray-500 text-xs'}>
                            If it takes more than usual, delete & check the url
                        </p>
                        <Button buttonSize={'small'} onClick={deleteNode}>
                            Cancel
                        </Button>
                    </Skeleton>
                </span>
            </div>
        </NodeViewWrapper>
    );
});

export const TweetEmbed = Node.create({
    name: 'twitter',

    group: 'block',

    atom: true,

    draggable: true,

    isolating: true,

    selectable: false,

    marks: '',

    addPasteRules() {
        const twitterUrl = /^https:\/\/(twitter\.com|x\.com)\/.*\/status\/.*/g;

        return [
            nodePasteRule({
                find: twitterUrl,
                type: this.type,
                getAttributes: match => {
                    return { url: match.input };
                },
            }),
        ];
    },

    addAttributes() {
        return {
            url: {
                default:
                    'https://twitter.com/vercel/status/1683920951807971329',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'twitter',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['twitter', mergeAttributes(HTMLAttributes)];
    },

    addCommands() {
        return {
            insertTweet:
                url =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs: { url },
                    });
                },
        };
    },

    addNodeView() {
        return ReactNodeViewRenderer(TweetComponent);
    },
});
