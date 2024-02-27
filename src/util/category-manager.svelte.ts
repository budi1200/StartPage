import type { ICategory, IStartPageData } from "src/types";
import { nanoid } from "nanoid";

// Note: there might be a better way to do this
export function createDataStore(value?: IStartPageData | undefined) {
    let state = $state(value);

    return {
        get value() {
            return state;
        },
        set value(v) {
            state = v;
        },
        addCategory: () => {
            let newCategory: ICategory = {
                id: nanoid(),
                label: "New Category",
                bookmarks: [],
            };

            state?.categories.push(newCategory);
        },
        deleteCategory: (categoryId: string) => {
            if (!state?.categories) return;
            state.categories = state?.categories.filter((c) => c.id !== categoryId);
        },
    };
}
