import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs.tsx';
import PostSidebarTab from '@/components/sidebar/tabs/PostSidebarTab.tsx';
import SeoSidebarTab from '@/components/sidebar/tabs/SeoSidebarTab.tsx';

export type CommonTabProps = {
    title: string;
};

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
];

const Sidebar = () => {
    return (
        <>
            <Tabs defaultValue="post">
                <TabsList className="grid w-full grid-cols-4">
                    {TABS.map(({ value, label }) => (
                        <TabsTrigger value={value} key={`tav-${value}`}>
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
                        {tab({ title })}
                    </TabsContent>
                ))}
            </Tabs>
        </>
    );
};

export default Sidebar;
