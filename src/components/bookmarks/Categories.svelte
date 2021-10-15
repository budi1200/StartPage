<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import Bookmark from "./Bookmark.svelte";

    const dispatch = createEventDispatcher();
    export let isEditing: Boolean;
    export let status: String;
    export let cloudData: String;

    const defaultConfig = [
        {
            id: "kptfyh1dru0otxw72a",
            label: "Social Media",
            bookmarks: [
                { id: "kptfyih4jyxljaf6z4o", label: "Facebook", url: "https://www.facebook.com" },
                { id: "kptfyx0taoar2eenjjj", label: "Messenger", url: "https://www.messenger.com" },
                {
                    id: "kptfyxj50cq9zdazwbi7",
                    label: "Instagram",
                    url: "https://www.instagram.com",
                },
                { id: "kptfyxwt40s3p1ppd7", label: "Reddit", url: "https://www.reddit.com" },
                { id: "kptfyyanz7j0ugg9ua", label: "Twitter", url: "https://www.twitter.com" },
            ],
        },
        {
            id: "kptfyhayai33ejo073a",
            label: "Entertainment",
            bookmarks: [
                { id: "kptfzcgrhcx2aicwyxj", label: "YouTube", url: "https://www.youtube.com" },
                {
                    id: "kptfzg3670uhwkxfei",
                    label: "The Hub",
                    url: "https://www.github.com",
                    alt: true,
                },
                {
                    id: "kptfzjrnked0b3pmupb",
                    label: "South Park",
                    url: "https://www.southparkstudios.com/seasons/south-park",
                },
            ],
        },
    ];

    const localKey = "startpage-categories";

    interface IBookmark {
        id: string;
        label: string;
        url: string;
        alt?: boolean;
    }

    interface ICategory {
        id: string;
        label: string;
        bookmarks: IBookmark[];
    }

    // Default Bookmarks - these are overridden by the localStorage
    let categories: ICategory[] = JSON.parse(localStorage.getItem(localKey)) ?? defaultConfig;

    const getUniqueId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    };

    const addCategory = () => {
        let a: ICategory = { id: getUniqueId(), label: "New Category", bookmarks: [] };
        categories = [...categories, a];
        // console.log(categories);
    };

    const addBookmark = (e) => {
        e.preventDefault();

        let inp = e.target.entry.value.split(", ");
        let categoryId = e.target.categoryId.value;

        if (categoryId === undefined || categoryId === "") {
            console.error("Missing category ID");
            return;
        }

        let categoryIndex = categories.findIndex((el) => el.id == categoryId);

        if (categoryIndex === -1) {
            console.error("Category not found");
            return;
        }

        let newBookmark: IBookmark = {
            id: getUniqueId(),
            label: inp[0],
            url: inp[1],
            alt: inp[2] == "true",
        };
        categories[categoryIndex].bookmarks = [...categories[categoryIndex].bookmarks, newBookmark];
        e.target.entry.value = "";

        // console.log(categories);
    };

    const deleteBookmark = (e) => {
        e.preventDefault();

        let categoryId = e.target.categoryId.value;
        let bookmarkId = e.target.bookmarkId.value;

        let categoryIndex = categories.findIndex((el) => el.id == categoryId);

        let bookmarkIndex = categories[categoryIndex].bookmarks.findIndex(
            (el) => el.id == bookmarkId,
        );

        categories[categoryIndex].bookmarks.splice(bookmarkIndex, 1);

        categories = [...categories];
    };

    const updateCategoryName = ({ target }, id: string) => {
        let name = target.value;

        if (id === undefined || id === "") {
            console.error("Missing category ID");
            return;
        }

        let categoryIndex = categories.findIndex((el) => el.id == id);

        if (categoryIndex === -1) {
            console.error("Category not found");
            return;
        }

        categories[categoryIndex].label = name;
    };

    const removeCategory = (id: string) => {
        if (id === undefined || id === "") {
            console.error("Missing category ID");
            return;
        }

        let categoryIndex = categories.findIndex((el) => el.id == id);

        if (categoryIndex === -1) {
            console.error("Category not found");
            return;
        }

        categories.splice(categoryIndex, 1);

        categories = [...categories];
    };

    const importData = () => {
        let result = prompt("Enter JSON data");

        if (result !== undefined && result !== "") {
            categories = JSON.parse(result);
            console.log("Data imported");
        }
    };

    const exportData = () => {
        alert("Exported to console");
        console.log(JSON.stringify(categories));
    };

    $: if (status === "save") {
        const stringified = JSON.stringify(categories)
        dispatch("state", null);
        dispatch("upload", stringified)
        localStorage.setItem(localKey, stringified);
    } else if (status === "cancel") {
        dispatch("state", null);
        categories = JSON.parse(localStorage.getItem(localKey)) ?? defaultConfig;
    }

    $: if (cloudData != null) {
      // TODO: error handling
      categories = cloudData as ICategory[]
      cloudData = null;
    }
</script>

<section class="bookmarks grid gap-4 items-baseline select-none max-w-6xl">
    {#each categories as category}
        <div class="bookmarkCategory glass rounded-md p-4">
            {#if isEditing}
                <h3 class="mb-1 text-white">
                    <input
                        type="text"
                        value={category.label}
                        class="bg-transparent text-white placeholder-gray-200 border-b border-gray-400"
                        on:keyup={(e) => updateCategoryName(e, category.id)}
                    />
                </h3>
            {:else}
                <h3 class="mb-1 text-white">{category.label}</h3>
            {/if}
            <ul>
                {#each category.bookmarks as bookmark}
                    <form
                        on:submit={deleteBookmark}
                        class={isEditing ? "flex justify-between" : ""}
                    >
                        <Bookmark {...bookmark} />
                        {#if isEditing}
                            <input type="hidden" name="categoryId" value={category.id} />
                            <input type="hidden" name="bookmarkId" value={bookmark.id} />
                            <button type="submit">
                                <img src="/assets/images/close_white_24dp.svg" alt="+" />
                            </button>
                        {/if}
                    </form>
                {/each}
                {#if isEditing}
                    <form on:submit={addBookmark}>
                        <div class="bookmark grid px-2">
                            <div class="bookmark-icon">
                                <button type="submit">
                                    <img src="/assets/images/add_white_24dp.svg" alt="+" />
                                </button>
                            </div>

                            <div class="bookmark-info flex">
                                <input type="hidden" name="categoryId" value={category.id} />
                                <div class="bookmark-info-label">
                                    <input
                                        type="text"
                                        name="entry"
                                        placeholder="Name, url, useAltFavicon"
                                        class="w-11/12 bg-transparent text-white placeholder-gray-200 border-b border-gray-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                    <button
                        type="button"
                        class="p-2 w-10 rounded-md float-right"
                        on:click={() => removeCategory(category.id)}
                    >
                        <img
                            src="/assets/images/close_white_24dp.svg"
                            alt="x"
                            title="Remove Category"
                        />
                    </button>
                {/if}
            </ul>
        </div>
    {/each}
    {#if isEditing}
        <div class="flex flex-col space-y-1">
            <button type="button" class="glass p-2 w-10 rounded-md" on:click={addCategory}>
                <img src="/assets/images/add_white_24dp.svg" alt="+" />
            </button>

            <button
                type="button"
                class="glass p-2 w-10 rounded-md"
                on:click={importData}
                title="Import"
            >
                <img src="/assets/images/file_upload_white_24dp.svg" alt="+" />
            </button>

            <button
                type="button"
                class="glass p-2 w-10 rounded-md"
                on:click={exportData}
                title="Export"
            >
                <img src="/assets/images/file_download_white_24dp.svg" alt="+" />
            </button>
        </div>
    {/if}
</section>

<style type="postcss">
    .bookmarks {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }

    .bookmark {
        @apply grid grid-cols-42 py-1 text-white;

        min-height: 50px;
        grid-template-columns: 42px 1fr;
    }

    .bookmark-icon {
        @apply flex items-center justify-center;
    }

    .bookmark-info-label {
        @apply transform-gpu translate-y-191 transition-transform duration-200 ease-in-out;
        backface-visibility: hidden;
    }
</style>
