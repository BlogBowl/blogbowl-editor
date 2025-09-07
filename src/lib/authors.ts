import { API } from '@/types.ts';
import { AuthorItem } from '@/components/core/Select/SelectAuthor.tsx';

const getAuthorName = (author: API.SimplifiedAuthor): string => {
    if (!author?.first_name && !author?.last_name) {
        return author.email;
    }
    let name = '';
    if (author?.first_name) {
        name += author.first_name + ' ';
    }

    if (author?.last_name) {
        name += author.last_name;
    }
    return name;
}

export const mapAuthorsToOptions = (authors?: API.SimplifiedAuthor[]): AuthorItem[] => {
    if (!authors) {
        return []
    }
    return authors.map(mapAuthorToOption);
};

export const mapAuthorToOption = (author: API.SimplifiedAuthor): AuthorItem => {
    return {
        label: getAuthorName(author),
        value: author.id.toString(),
        avatar: author?.avatar,
    }
}
