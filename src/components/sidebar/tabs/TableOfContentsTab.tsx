import {
    TableOfContents,
    TableOfContentsProps,
} from '@/components/tiptap/TableOfContents';
import SidebarTabWrapper, {
    SidebarChildrenWrapper,
} from '@/components/sidebar/SidebarTabWrapper.tsx';
import { CommonTabProps } from '@/components/sidebar';

const TableOfContentsTab = ({
    title,
    ...rest
}: CommonTabProps & TableOfContentsProps) => {
    return (
        <SidebarTabWrapper title={title}>
            <SidebarChildrenWrapper>
                <TableOfContents {...rest} />
            </SidebarChildrenWrapper>
        </SidebarTabWrapper>
    );
};

export default TableOfContentsTab;
