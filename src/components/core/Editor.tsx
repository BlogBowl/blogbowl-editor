import { TiptapCollabProvider } from '@hocuspocus/provider';
import { useState } from 'react';

import { BlockEditor } from '@/components/tiptap/BlockEditor';

// const useDarkmode = () => {
//     const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

//     useEffect(() => {
//         const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
//         const handleChange = () => setIsDarkMode(mediaQuery.matches);
//         mediaQuery.addEventListener('change', handleChange);
//         return () => mediaQuery.removeEventListener('change', handleChange);
//     }, []);

//     useEffect(() => {
//         document.documentElement.classList.toggle('dark', isDarkMode);
//     }, [isDarkMode]);

//     const toggleDarkMode = useCallback(
//         () => setIsDarkMode(isDark => !isDark),
//         [],
//     );
//     const lightMode = useCallback(() => setIsDarkMode(false), []);
//     const darkMode = useCallback(() => setIsDarkMode(true), []);

//     return {
//         isDarkMode,
//         toggleDarkMode,
//         lightMode,
//         darkMode,
//     };
// };

const Editor = () => {
    // const { isDarkMode, darkMode, lightMode } = useDarkmode();
    const [provider] = useState<TiptapCollabProvider | null>(null);

    // const DarkModeSwitcher = createPortal(
    //     <Surface className="flex items-center gap-1 fixed bottom-6 right-6 z-[99999] p-1">
    //         <Toolbar.Button onClick={lightMode} active={!isDarkMode}>
    //             <Icon name="Sun" />
    //         </Toolbar.Button>
    //         <Toolbar.Button onClick={darkMode} active={isDarkMode}>
    //             <Icon name="Moon" />
    //         </Toolbar.Button>
    //     </Surface>,
    //     document.body,
    // );

    return (
        <>
            {/*{DarkModeSwitcher}*/}
            <BlockEditor provider={provider} />
        </>
    );
};

export default Editor;
