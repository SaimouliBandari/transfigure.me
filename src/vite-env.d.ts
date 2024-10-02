/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly MGST_TRANSFIGURE_SERVICE: string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }