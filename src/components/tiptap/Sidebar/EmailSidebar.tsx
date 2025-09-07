import { cn } from '@/lib/utils';
import { memo, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs.tsx';
import EmailSidebarTab from '@/components/sidebar/tabs/EmailSidebarTab.tsx';

const TABS = [
    {
        value: 'email',
        label: 'Email',
        title: 'E-mail settings',
        tab: EmailSidebarTab,
    },
];

export const EmailSidebar = memo(
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
                        <Tabs defaultValue="email" className={'h-full'}>
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
                                    className={'h-[calc(100%-3rem)]'}
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
                    </div>
                </div>
            </div>
        );
    },
);

EmailSidebar.displayName = 'TableOfContentSidepanel';
