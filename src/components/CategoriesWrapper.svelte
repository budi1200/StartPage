<script lang="ts">
    import { dataStore, isEditing } from "@/store/data.store";
    import { addCategory } from "@/util/category-manager";
    import { exportData, importData } from "@/util/data-manager";
    import Category from "./Category.svelte";
    import IconAdd from "@/components/icons/IconAdd.svelte";
    import IconUpload from "@/components/icons/IconUpload.svelte";
    import IconDownload from "@/components/icons/IconDownload.svelte";
</script>

<section class="flex select-none flex-wrap items-baseline gap-4">
    {#if $dataStore !== undefined}
        {#each $dataStore.categories as category}
            <Category categoryData={category} />
        {/each}
    {/if}

    {#if $isEditing}
        <div class="flex flex-col space-y-1">
            <button type="button" class="glass flex w-10 rounded-md p-2" on:click={addCategory}>
                <IconAdd />
            </button>

            <button type="button" class="glass flex w-10 rounded-md p-2" on:click={importData} title="Import">
                <IconUpload />
            </button>

            <button type="button" class="glass flex w-10 rounded-md p-2" on:click={exportData} title="Export">
                <IconDownload />
            </button>
        </div>
    {/if}
</section>
