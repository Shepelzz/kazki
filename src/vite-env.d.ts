/// <reference types="vite/client" />

declare module '*.yaml' {
  const data: Record<string, any>;
  export default data;
}

/** DEBUG=TRUE at build time: the skip buttons are shown */
declare const __DEBUG__: boolean;
