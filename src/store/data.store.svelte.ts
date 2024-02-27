import { createDataStore } from "@/util/category-manager.svelte";

export let dataStore = createDataStore();
export let isEditing = writable<boolean>(false);
export let authToken = writable<string | undefined>();
export let isSyncing = writable<boolean>(false);

export function writable<T>(value?: T) {
    let state = $state(value);

    return {
        get value() {
            return state;
        },
        set value(v) {
            state = v;
        },
    };
}
