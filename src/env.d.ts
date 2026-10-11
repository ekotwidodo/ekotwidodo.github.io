/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module '*?raw' {
  const content: string;
  export default content;
}

declare module '*.yaml' {
  const data: any;
  export default data;
}

declare module '*.yml' {
  const data: any;
  export default data;
}
