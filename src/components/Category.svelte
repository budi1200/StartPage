<script lang="ts">
    import { isEditing } from "@/store/data.store.svelte";
    import type { ICategory } from "@/types";
    import Bookmark from "./Bookmark.svelte";
    import BookmarkModal from "@/components/modals/BookmarkModal.svelte";
    import { swap } from "@/util/swap";
    import FancyCard from "@/components/elements/FancyCard.svelte";
    import Input from "@/components/elements/Input.svelte";
    import PhTrash from "~icons/ph/trash";
    import PhPlus from "~icons/ph/plus";
    import PhCaretLeft from "~icons/ph/caret-left";
    import PhCaretRight from "~icons/ph/caret-right";

    let {
        categoryData = $bindable(),
        deleteCategory,
        listIndex,
        listLength,
        moveLeft,
        moveRight,
    }: {
        categoryData: ICategory;
        deleteCategory: (id: string) => void;
        listIndex: number;
        listLength: number;
        moveLeft: (index: number) => void;
        moveRight: (index: number) => void;
    } = $props();
    let addBookmarkModal = $state<BookmarkModal>();

    const deleteBookmark = (id: string) => {
        categoryData.bookmarks = categoryData.bookmarks.filter((x) => x.id !== id);
    };

    const moveUp = (index: number) => swap(categoryData.bookmarks, index, index - 1);
    const moveDown = (index: number) => swap(categoryData.bookmarks, index, index + 1);
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
                        onclick={() => moveLeft(listIndex)}
                    >
                        <PhCaretLeft />
                    </button>
                {/if}

                {#if listIndex < listLength - 1}
                    <button
                        class="cursor-pointer rounded-md p-1 transition-all hover:bg-hoverGrey"
                        onclick={() => moveRight(listIndex)}
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
                onclick={() => addBookmarkModal?.openModal()}
            >
                {#snippet icon()}<PhPlus />{/snippet}
            </FancyCard>

            <FancyCard
                class="cursor-pointer"
                title="Delete"
                subtitle="Delete category"
                onclick={() => deleteCategory(categoryData.id)}
            >
                {#snippet icon()}<PhTrash />{/snippet}
            </FancyCard>
        {/if}
    </div>
</article>

<BookmarkModal
    bind:this={addBookmarkModal}
    title="New bookmark"
    onsave={(added) => categoryData.bookmarks.push(added)}
/>
