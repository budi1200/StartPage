import type { IStartPageData } from "src/types";
import { writable } from "svelte/store";

export const dataStore = writable<IStartPageData | undefined>();
export const isEditing = writable<boolean>(false);
export const authToken = writable<string | undefined>();
export const isSyncing = writable<boolean>(false);
