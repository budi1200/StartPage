<script lang="ts">
    import {dataStore, isEditing} from "@/store/data.store";
    import {addCategory} from "@/util/category-manager";
    import {exportData, importData} from "@/util/data-manager";
    import Category from "./Category.svelte";
</script>

<section class="flex gap-4 items-baseline select-none flex-wrap">
    {#if $dataStore !== undefined}
        {#each $dataStore.categories as category}
            <Category categoryData={category}/>
        {/each}
    {/if}

    {#if $isEditing}
        <div class="flex flex-col space-y-1">
            <button type="button" class="glass p-2 w-10 rounded-md flex" on:click={addCategory}>
                <span class="material-icons-outlined !leading-none text-white">add</span>
            </button>

            <button
                type="button"
                class="glass p-2 w-10 rounded-md flex"
                on:click={importData}
                title="Import"
            >
                <span class="material-icons-outlined !leading-none text-white">file_upload</span>
            </button>

            <button
                type="button"
                class="glass p-2 w-10 rounded-md flex"
                on:click={exportData}
                title="Export"
            >
                <span class="material-icons-outlined !leading-none text-white">file_download</span>
            </button>
        </div>
    {/if}
</section>
