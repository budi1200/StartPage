<script lang="ts">
    import { type IBookmark } from "@/types";
    import FancyCard from "@/components/elements/FancyCard.svelte";
    import { isEditing } from "@/store/data.store.svelte";
    import { getFaviconUrl } from "@/util/favicon-helper";
    import BookmarkModal from "@/components/modals/BookmarkModal.svelte";
    import PhTrash from "~icons/ph/trash";
    import PhPencilSimple from "~icons/ph/pencil-simple";
    import PhCaretUp from "~icons/ph/caret-up";
    import PhCaretDown from "~icons/ph/caret-down";

    let {
        bookmark = $bindable(),
        deleteBookmark,
        listIndex,
        listLength,
        moveUp,
        moveDown,
    }: {
        bookmark: IBookmark;
        deleteBookmark: (id: string) => void;
        listIndex: number;
        listLength: number;
        moveUp: (index: number) => void;
        moveDown: (index: number) => void;
    } = $props();
    let editModal = $state<BookmarkModal>();
</script>

<div class="flex items-center justify-between gap-1.5 rounded-md">
    {#if isEditing.value}
        <div class="flex flex-col text-sm">
            {#if listIndex > 0}
                <button
                    class="cursor-pointer rounded-md p-1 transition-all hover:bg-hoverGrey"
                    onclick={() => moveUp(listIndex)}
                >
                    <PhCaretUp />
                </button>
            {/if}
            {#if listIndex < listLength - 1}
                <button
                    class="cursor-pointer rounded-md p-1 transition-all hover:bg-hoverGrey"
                    onclick={() => moveDown(listIndex)}
                >
                    <PhCaretDown />
                </button>
            {/if}
        </div>
    {/if}
    <a href={isEditing.value ? "#" : bookmark.url} class="w-full">
        <FancyCard title={bookmark.title} subtitle={bookmark.subtitle}>
            {#snippet icon()}
                <img
                    class="h-4 w-4"
                    src={getFaviconUrl(bookmark.iconType, bookmark.host)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                />
            {/snippet}
        </FancyCard>
    </a>
    {#if isEditing.value}
        <button
            class="cursor-pointer rounded-md p-1.5 transition-all hover:bg-hoverGrey"
            onclick={() => editModal?.openModal()}
        >
            <PhPencilSimple />
        </button>
        <button
            class="cursor-pointer rounded-md p-1.5 transition-all hover:bg-hoverGrey"
            onclick={() => deleteBookmark(bookmark.id)}
        >
            <PhTrash />
        </button>
        <BookmarkModal
            bind:this={editModal}
            title="Edit bookmark"
            {bookmark}
            onsave={(edited) => (bookmark = edited)}
        />
    {/if}
</div>
