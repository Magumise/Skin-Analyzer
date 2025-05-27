/// <reference types="vite/client" />

declare module '*.jpg' {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // Add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 