<script lang="ts">
    import { isEditing } from "@/store/data.store";
    import type { ICategory } from "@/types";
    import { deleteCategory } from "@/util/category-manager";
    import Bookmark from "./Bookmark.svelte";
    import AddBookmarkModal from "@/components/modals/AddBookmarkModal.svelte";
    import FancyCard from "@/components/elements/FancyCard.svelte";
    import Input from "@/components/elements/Input.svelte";

    export let categoryData: ICategory;

    let addBookmarkModal: AddBookmarkModal;

    const deleteBookmark = (id: string) => {
        let index = categoryData.bookmarks.findIndex((x) => x.id === id);

        if (index == -1) {
            // TODO: Toasty
            return;
        }

        categoryData.bookmarks.splice(index, 1);
        categoryData.bookmarks = categoryData.bookmarks; // Refresh state
    };
</script>

<article class="glass z-10 w-72 rounded-md p-4">
    {#if $isEditing}
        <h3>
            <Input bind:value={categoryData.label} />
        </h3>
    {:else}
        <h3 class="mb-1 text-base">{categoryData.label}</h3>
    {/if}

    <div class="flex flex-col gap-0.5">
        {#each categoryData.bookmarks as bookmark}
            <div class="flex items-center justify-between">
                <Bookmark bookmarkData={bookmark} />
                {#if $isEditing}
                    <span
                        class="material-icons-outlined ml-2 cursor-pointer rounded-md p-2 !text-base !leading-none transition-all hover:bg-hoverGrey"
                        on:click={() => deleteBookmark(bookmark.id)}
                    >
                        delete
                    </span>
                {/if}
            </div>
        {/each}

        {#if $isEditing}
            <FancyCard
                class="cursor-pointer"
                title="New"
                subtitle="Add a new bookmark"
                on:click={() => addBookmarkModal.openModal()}
            >
                <span slot="icon" class="material-icons-outlined !text-base !leading-none">add</span>
            </FancyCard>

            <FancyCard
                class="cursor-pointer"
                title="Delete"
                subtitle="Delete category"
                on:click={() => deleteCategory(categoryData.id)}
            >
                <span slot="icon" class="material-icons-outlined !text-base !leading-none">delete</span>
            </FancyCard>
        {/if}
    </div>
</article>
<AddBookmarkModal bind:this={addBookmarkModal} bind:category={categoryData} />
