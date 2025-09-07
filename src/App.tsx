import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import './globals.css';

import 'cal-sans';

import '@fontsource/inter/100.css';
import '@fontsource/inter/200.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import { createContext, ReactNode, useContext, useState } from 'react';
import { API } from '@/types.ts';
import PostEditor from '@/components/tiptap/BlockEditor/PostEditor.tsx';
import EmailEditor from '@/components/tiptap/BlockEditor/EmailEditor.tsx';

const queryClient = new QueryClient();

type Props = {
    post: API.Post;
    page: API.Page;
    newsletter: API.Newsletter;
    revision?: API.Revision;
    email: API.Email;
    disableControls: boolean;
    type: 'email' | 'post';
    subscribersCount?: number;
    settingsFilled?: boolean;
    isPaying: boolean;
};

export type AppMainContextType = Props & {
    updatePost: (post: API.Post) => void;
    updateRevision: (revision: API.Revision) => void;
    updateEmail: (email: API.Email) => void;
};

const EditorContext = createContext<AppMainContextType>(
    {} as AppMainContextType,
);

type EditorProviderProps = {
    children: ReactNode;
    value: Props;
};

export function EditorProvider({ children, value }: EditorProviderProps) {
    const [post, setPost] = useState(value?.post);
    const [email, setEmail] = useState(value?.email);
    const [revision, setRevision] = useState(value?.revision);

    const updatePost = (updatePost: API.Post) => {
        setPost(updatePost);
    };

    const updateRevision = (updateRevision: API.Revision) => {
        setRevision(updateRevision);
    };

    const updateEmail = (updateEmailData: API.Email) => {
        setEmail(updateEmailData);
    };

    const preparedValue: AppMainContextType = {
        disableControls: value.disableControls,
        post,
        page: value.page,
        revision,
        updatePost,
        updateRevision,
        updateEmail,
        email,
        newsletter: value.newsletter,
        type: value.type,
        subscribersCount: value?.subscribersCount,
        settingsFilled: value?.settingsFilled,
        isPaying: value?.isPaying,
    };

    return (
        <EditorContext.Provider value={preparedValue}>
            {children}
        </EditorContext.Provider>
    );
}

export function useMainContext() {
    return useContext(EditorContext);
}

function App(props: Props) {
    const Editor = props.type === 'post' ? PostEditor : EmailEditor;

    console.log(props);

    return (
        <EditorProvider value={props}>
            <QueryClientProvider client={queryClient}>
                <main className="h-full">
                    <Toaster />
                    <Editor />
                </main>
            </QueryClientProvider>
        </EditorProvider>
    );
}

export default App;
