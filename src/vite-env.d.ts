/// <reference types="vite/client" />

declare module '*.yaml' {
  const data: Record<string, any>;
  export default data;
}

/** DEBUG=TRUE at build time: the skip buttons are shown */
declare const __DEBUG__: boolean;

declare module 'virtual:tales' {
  const tales: Record<string, import('./story').TaleInfo>;
  export default tales;
}

declare module 'virtual:wardrobe-art' {
  const art: Record<string, () => Promise<{ default: { id: string; slot: import('./dress').Slot; beard: boolean; svg: string } }>>;
  export default art;
}

declare module 'virtual:wardrobe-catalog' {
  const catalog: {
    items: Record<string, { slot: import('./dress').Slot; name: string; price: number }>;
    /** hero → the things it can wear */
    sets: Record<string, string[]>;
    /** what a hero with no set can wear */
    any: string[];
  };
  export default catalog;
}
