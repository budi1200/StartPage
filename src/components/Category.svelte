<script lang="ts">
    import { isEditing } from "@/store/data.store.svelte";
    import type { ICategory } from "@/types";
    import Bookmark from "./Bookmark.svelte";
    import AddBookmarkModal from "@/components/modals/AddBookmarkModal.svelte";
    import FancyCard from "@/components/elements/FancyCard.svelte";
    import Input from "@/components/elements/Input.svelte";
    import PhTrash from "~icons/ph/trash";
    import PhPlus from "~icons/ph/plus";
    import PhCaretLeft from "~icons/ph/caret-left";
    import PhCaretRight from "~icons/ph/caret-right";

    let { categoryData, deleteCategory, listIndex, listLength, moveLeft, moveRight } = $props<{
        categoryData: ICategory;
        deleteCategory: (id: string) => void;
        listIndex: number;
        listLength: number;
        moveLeft: (index: number) => void;
        moveRight: (index: number) => void;
    }>();
    let addBookmarkModal = $state<AddBookmarkModal>();

    const deleteBookmark = (id: string) => {
        categoryData.bookmarks = categoryData.bookmarks.filter((x) => x.id !== id);
    };

    const moveUp = (index: number) => {
        if (index === 0) return;
        const temp = categoryData.bookmarks[index];
        categoryData.bookmarks[index] = categoryData.bookmarks[index - 1];
        categoryData.bookmarks[index - 1] = temp;
    };

    const moveDown = (index: number) => {
        if (index === categoryData.bookmarks.length - 1) return;
        const temp = categoryData.bookmarks[index];
        categoryData.bookmarks[index] = categoryData.bookmarks[index + 1];
        categoryData.bookmarks[index + 1] = temp;
    };
</script>

<article class="glass z-10 w-72 rounded-md border border-transparent p-4">
    {#if isEditing.value}
        <div class="flex items-center justify-between gap-2">
            <h3>
                <Input bind:value={categoryData.label} placeholder={categoryData.label} />
            </h3>

            <div class="flex gap-2">
                {#if listIndex > 0}
                    <button
                        class="cursor-pointer rounded-md p-1 transition-all hover:bg-hoverGrey"
                        on:click={() => moveLeft(listIndex)}
                    >
                        <PhCaretLeft />
                    </button>
                {/if}

                {#if listIndex < listLength - 1}
                    <button
                        class="cursor-pointer rounded-md p-1 transition-all hover:bg-hoverGrey"
                        on:click={() => moveRight(listIndex)}
                    >
                        <PhCaretRight />
                    </button>
                {/if}
            </div>
        </div>
    {:else}
        <h3 class="mb-1 text-base">{categoryData.label}</h3>
    {/if}

    <div class="flex flex-col gap-0.5">
        {#each categoryData.bookmarks as _, index}
            <Bookmark
                bind:bookmark={categoryData.bookmarks[index]}
                {deleteBookmark}
                listIndex={index}
                listLength={categoryData.bookmarks.length}
                {moveUp}
                {moveDown}
            />
        {/each}

        {#if isEditing.value}
            <FancyCard
                class="cursor-pointer"
                title="New"
                subtitle="Add a new bookmark"
                on:click={() => addBookmarkModal?.openModal()}
            >
                <PhPlus slot="icon" />
            </FancyCard>

            <FancyCard
                class="cursor-pointer"
                title="Delete"
                subtitle="Delete category"
                on:click={() => deleteCategory(categoryData.id)}
            >
                <PhTrash slot="icon" />
            </FancyCard>
        {/if}
    </div>
</article>

<AddBookmarkModal bind:this={addBookmarkModal} bind:category={categoryData} />
