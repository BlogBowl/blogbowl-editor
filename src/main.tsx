import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        {/* @ts-expect-error props are injected from HTML on mount */}
        <App />
    </React.StrictMode>,
);
