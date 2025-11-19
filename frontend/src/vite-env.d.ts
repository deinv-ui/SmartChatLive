/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly SOCKET_URL: "http://localhost:5000";

  // add other VITE_ variables here as needed
}

interface ImportMetaEnv {
  // add other VITE_ variables here as needed
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
