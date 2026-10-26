/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference types="unplugin-icons/types/svelte" />

declare var chrome:
    | {
          identity?: {
              getRedirectURL(): string;
              launchWebAuthFlow(details: { url: string; interactive: boolean }): Promise<string>;
          };
      }
    | undefined;
