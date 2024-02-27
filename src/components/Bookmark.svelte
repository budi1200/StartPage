<script lang="ts">
    import { type IBookmark } from "@/types";
    import FancyCard from "@/components/elements/FancyCard.svelte";
    import { isEditing } from "@/store/data.store.svelte";
    import { getFaviconUrl } from "@/util/favicon-helper";
    import EditBookmarkModal from "@/components/modals/EditBookmarkModal.svelte";
    import PhTrash from "~icons/ph/trash";
    import PhPencilSimple from "~icons/ph/pencil-simple";
    import PhCaretUp from "~icons/ph/caret-up";
    import PhCaretDown from "~icons/ph/caret-down";

    let { bookmark, deleteBookmark, listIndex, listLength, moveUp, moveDown } = $props<{
        bookmark: IBookmark;
        deleteBookmark: (id: string) => void;
        listIndex: number;
        listLength: number;
        moveUp: (index: number) => void;
        moveDown: (index: number) => void;
    }>();
    let editModal = $state<EditBookmarkModal>();
</script>

<div class="flex items-center justify-between gap-1.5 rounded-md">
    {#if isEditing.value}
        <div class="flex flex-col text-sm">
            {#if listIndex > 0}
                <button
                    class="cursor-pointer rounded-md p-1 transition-all hover:bg-hoverGrey"
                    on:click={() => moveUp(listIndex)}
                >
                    <PhCaretUp />
                </button>
            {/if}
            {#if listIndex < listLength - 1}
                <button
                    class="cursor-pointer rounded-md p-1 transition-all hover:bg-hoverGrey"
                    on:click={() => moveDown(listIndex)}
                >
                    <PhCaretDown />
                </button>
            {/if}
        </div>
    {/if}
    <a href={isEditing.value ? "#" : bookmark.url} class="w-full">
        <FancyCard title={bookmark.title} subtitle={bookmark.subtitle}>
            <img
                slot="icon"
                class="h-4 w-4"
                src={getFaviconUrl(bookmark.iconType, bookmark.host)}
                alt=""
                loading="lazy"
                decoding="async"
            />
        </FancyCard>
    </a>
    {#if isEditing.value}
        <button
            class="cursor-pointer rounded-md p-1.5 transition-all hover:bg-hoverGrey"
            on:click={() => editModal?.openModal()}
        >
            <PhPencilSimple />
        </button>
        <button
            class="cursor-pointer rounded-md p-1.5 transition-all hover:bg-hoverGrey"
            on:click={() => deleteBookmark(bookmark.id)}
        >
            <PhTrash />
        </button>
        <EditBookmarkModal bind:this={editModal} bind:bookmark />
    {/if}
</div>
