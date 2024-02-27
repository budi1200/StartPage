<script lang="ts">
    import { dataStore, isEditing } from "@/store/data.store.svelte";
    import { exportData, importData, loadLocalData } from "@/util/data-manager.svelte";
    import Category from "./Category.svelte";
    import PhPlus from "~icons/ph/plus";
    import PhDownload from "~icons/ph/download";
    import PhUpload from "~icons/ph/upload";

    $effect(() => {
        loadLocalData();
    });

    // Note: Workaround because using the "store/state" directly throws a warning ¯\_(ツ)_/¯
    const deleteWorkaround = (id: any) => {
        dataStore.deleteCategory(id);
    };

    const moveLeft = (index: number) => {
        if (index === 0 || !dataStore.value) return;
        const temp = dataStore.value.categories[index];
        dataStore.value.categories[index] = dataStore.value.categories[index - 1];
        dataStore.value.categories[index - 1] = temp;
    };

    const moveRight = (index: number) => {
        if (!dataStore.value || index === dataStore.value.categories.length - 1) return;
        const temp = dataStore.value.categories[index];
        dataStore.value.categories[index] = dataStore.value.categories[index + 1];
        dataStore.value.categories[index + 1] = temp;
    };
</script>

<section class="flex select-none flex-wrap items-start gap-4">
    {#if dataStore.value !== undefined}
        {#each dataStore.value.categories as _, index}
            <Category
                bind:categoryData={dataStore.value.categories[index]}
                deleteCategory={deleteWorkaround}
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
