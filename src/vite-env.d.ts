/// <reference types="vite/client" />

declare module 'virtual:pwa-register/react' {
  import type { Dispatch, SetStateAction } from 'react'

  interface RegisterSWOptions {
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void
    onRegisterError?: (error: unknown) => void
  }

  function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: [boolean, Dispatch<SetStateAction<boolean>>]
    offlineReady: [boolean, Dispatch<SetStateAction<boolean>>]
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  }

  export { useRegisterSW }
  export type { RegisterSWOptions }
}
