/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_META_PIXEL_ID: string
  readonly VITE_CF_BEACON_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
