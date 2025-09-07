import { Youtube as DefaultYoutube } from '@tiptap/extension-youtube';

export const ExtendedYoutube = DefaultYoutube.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            videoId: {
                default: null,
            },
            src: {
                default: null,
            },
        };
    },

    addCommands() {
        return {
            ...this.parent?.(),
            setYoutubeVideo:
                options =>
                ({ commands }) => {
                    let videoId = options.videoId;

                    if (!videoId && options.src) {
                        // Extract videoId from src URL if not provided
                        const match = options.src.match(
                            /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([\w-]{11})/,
                        );
                        videoId = match ? match[1] : null;
                    }

                    if (!videoId) {
                        return false; // invalid videoId, do nothing
                    }

                    return commands.insertContent({
                        type: this.name,
                        attrs: {
                            videoId,
                            src:
                                options.src ||
                                `https://www.youtube.com/watch?v=${videoId}`,
                            width: options.width || 560,
                            height: options.height || 315,
                        },
                    });
                },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'iframe[src*="youtube.com/embed/"]',
                getAttrs: node => {
                    if (!node) return false;

                    const src = node.getAttribute('src');
                    const match = src?.match(/youtube\.com\/embed\/([\w-]+)/);

                    if (!match) return false;

                    return {
                        videoId: match[1],
                        src: `https://www.youtube.com/watch?v=${match[1]}`,
                    };
                },
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        const videoId = HTMLAttributes.videoId;
        const src = `https://www.youtube-nocookie.com/embed/${videoId}`;

        return [
            'div',
            { 'data-youtube-video': '' },
            [
                'iframe',
                {
                    src,
                    width: 560,
                    height: 315,
                    frameborder: '0',
                    allowfullscreen: 'true',
                    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
                },
            ],
        ];
    },
});
