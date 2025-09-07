import { HTMLInputTypeAttribute } from 'react';
import {
    FieldError,
    FieldValues,
    Path,
    RegisterOptions,
    UseFormRegister,
} from 'react-hook-form';

export type FormHookProps<T extends FieldValues> = {
    register: UseFormRegister<T>;
    rules?: RegisterOptions<T>;
    name: Path<T>;
    error?: FieldError;
};

export type InputProps = {
    label?: string;
    placeholder: string;
    isRequired?: boolean;
    className?: string;
    disabled?: boolean;
    multiline?: boolean;
    size?: 'small' | 'big';
    type?: HTMLInputTypeAttribute;
    withErrorMsg?: boolean;
    warningMessage?: string;
};

export type SyncStateType = 'syncing' | 'synced' | 'error';

export type Category = {
    id?: number;
    name: string;
    description: string;
    parent_id?: number | null;
    created_at?: string;
    updated_at?: string;
    page_id: number;
    slug?: string;
    color?: string;
};

export namespace API {
    export type Page = {
        id: number;
        slug: string;
        name_slug: string;
        domain: string;
    };
    export type Post = {
        id: number;
        title: string;
        page_id: number;
        created_at: string;
        updated_at: string;
        status: string;
        category_id: number;
        slug: string;
        authors: SimplifiedAuthor[];
        reviewers: SimplifiedAuthor[];
        sharing_image?: string;
        cover_image?: string;
        description?: string;
        seo_title?: string;
        seo_description?: string;
        og_title?: string;
        og_description?: string;
    };

    export type Revision = {
        id: number;
        title: string;
        content_html: string;
        content_json: object;
        kind: 'draft' | 'history';
        post_id: number;
        seo_title: string;
        seo_description: string;
        og_title: string;
        og_description: string;
        updated_at: string;
        created_at: string;
        share_id?: string;
    };

    export type Newsletter = {
        id: number;
        name: string;
        name_slug: string;
        workspace_id: number;
        updated_at: string;
        created_at: string;
    };

    export type Email = {
        id: number;
        subject?: string;
        preview?: string;
        slug: string;
        content_json: object;
        content_html: string;
        author_id?: number;
        status: 'draft' | 'scheduled' | 'sent' | 'failed';
        scheduled_at: string;
        settings: {
            sender_email?: string;
            sender_name?: string;
            footer?: string;
        };
        author?: Author;
    };

    export type SendEmail = {
        scheduled_at: string;
    };

    export type SimplifiedAuthor = {
        id: number;
        first_name?: string;
        last_name?: string;
        email: string;
        avatar?: string;
    };

    export type Author = SimplifiedAuthor & {
        position?: string;
        short_description?: string;
        long_description?: string;
        active: boolean;
        member_id: number;
        created_at: string;
        updated_at: string;
        formatted_name?: string;
    };
}
