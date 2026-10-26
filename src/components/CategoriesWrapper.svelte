<script lang="ts">
    import { dataStore, isEditing } from "@/store/data.store.svelte";
    import { exportData, importData } from "@/util/data-manager.svelte";
    import { swap } from "@/util/swap";
    import Category from "./Category.svelte";
    import PhPlus from "~icons/ph/plus";
    import PhDownload from "~icons/ph/download";
    import PhUpload from "~icons/ph/upload";

    const moveCategory = (from: number, to: number) => {
        if (!dataStore.value) return;
        swap(dataStore.value.categories, from, to);
    };
    const moveLeft = (index: number) => moveCategory(index, index - 1);
    const moveRight = (index: number) => moveCategory(index, index + 1);
</script>

<section class="flex flex-wrap items-start gap-4 select-none">
    {#if dataStore.value !== undefined}
        {#each dataStore.value.categories as _, index}
            <Category
                bind:categoryData={dataStore.value.categories[index]}
                deleteCategory={dataStore.deleteCategory}
                listIndex={index}
                listLength={dataStore.value.categories.length}
                {moveLeft}
                {moveRight}
            />
        {/each}
    {/if}

    {#if isEditing.value}
        <div class="flex flex-col space-y-1">
            <button type="button" class="glass rounded-md p-2.5" onclick={dataStore.addCategory} title="Add category">
                <PhPlus />
            </button>

            <button type="button" class="glass rounded-md p-2.5" onclick={importData} title="Import">
                <PhUpload />
            </button>

            <button type="button" class="glass rounded-md p-2.5" onclick={exportData} title="Export">
                <PhDownload />
            </button>
        </div>
    {/if}
</section>
