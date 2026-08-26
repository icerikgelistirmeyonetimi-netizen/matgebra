/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const bilesen: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default bilesen
}
