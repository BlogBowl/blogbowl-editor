import { cn } from '@/lib/utils';
import { memo, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs.tsx';
import PostSidebarTab from '@/components/sidebar/tabs/PostSidebarTab.tsx';
import SeoSidebarTab from '@/components/sidebar/tabs/SeoSidebarTab.tsx';
import TableOfContentsTab from '@/components/sidebar/tabs/TableOfContentsTab.tsx';

const TABS = [
    {
        value: 'post',
        label: 'Post',
        title: 'Post settings',
        tab: PostSidebarTab,
    },
    {
        value: 'seo',
        label: 'SEO',
        title: 'SEO settings',
        tab: SeoSidebarTab,
    },
    {
        value: 'table_of_contents',
        label: 'ToC',
        title: 'Table of contents',
        tab: TableOfContentsTab,
    },
];

export const Sidebar = memo(
    ({
        editor,
        isOpen,
        onClose,
    }: {
        editor: Editor;
        isOpen?: boolean;
        onClose: () => void;
    }) => {
        const handlePotentialClose = useCallback(() => {
            if (window.innerWidth < 1024) {
                onClose();
            }
        }, [onClose]);

        const windowClassName = cn(
            'absolute top-0 right-0 bg-white lg:bg-white/30 lg:backdrop-blur-xl h-full lg:h-auto lg:relative z-20 w-0 duration-300 transition-all',
            'dark:bg-black lg:dark:bg-black/30',
            !isOpen && 'border-l-transparent',
            isOpen &&
                'w-96 border-l border-l-neutral-200 dark:border-l-neutral-800',
        );

        return (
            <div className={windowClassName}>
                <div className="w-full h-full overflow-hidden">
                    <div className="w-full h-full py-1 px-1 overflow-auto">
                        <Tabs defaultValue="post">
                            <TabsList className="grid w-full grid-cols-4">
                                {TABS.map(({ value, label }) => (
                                    <TabsTrigger
                                        value={value}
                                        key={`tav-${value}`}
                                    >
                                        {label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                            {TABS.map(({ value, title, tab }) => (
                                <TabsContent
                                    value={value}
                                    className={'h-full'}
                                    key={`tab-${value}`}
                                >
                                    {tab({
                                        title,
                                        editor,
                                        onItemClick: handlePotentialClose,
                                    })}
                                </TabsContent>
                            ))}
                        </Tabs>
                        {/*<TableOfContents*/}
                        {/*    editor={editor}*/}
                        {/*    onItemClick={handlePotentialClose}*/}
                        {/*/>*/}
                    </div>
                </div>
            </div>
        );
    },
);

Sidebar.displayName = 'TableOfContentSidepanel';
