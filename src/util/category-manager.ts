import { dataStore } from "src/store/data.store";
import type { ICategory } from "src/types"
import { v4 as uuidv4 } from "uuid";

export const addCategory = () => {
    let newCategory: ICategory = {
        id: uuidv4(),
        label: "New Category",
        bookmarks: []
    }

    dataStore.update((el) => {
        el.categories.push(newCategory);
        return el;
    })
}

export const deleteCategory = (categoryId: string) => {
    dataStore.update((el) => {
        const index = el.categories.findIndex((el) => el.id === categoryId);

        if (index === undefined) {
            // TODO: Error toast
            return;
        }

        el.categories.splice(index, 1)
        return el;
    })
}