/// <reference types="vite/client" />

export {};

declare global {
    interface Window {
        cfg: {
            host: string;
        };
    }
}
