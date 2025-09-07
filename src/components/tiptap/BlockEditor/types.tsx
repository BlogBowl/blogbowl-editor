import { TiptapCollabProvider } from '@hocuspocus/provider';

export interface TiptapProps {
    provider?: TiptapCollabProvider | null | undefined;
}

export type EditorUser = {
    clientId: string;
    name: string;
    color: string;
    initials?: string;
};
