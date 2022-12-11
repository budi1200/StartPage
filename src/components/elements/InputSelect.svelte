<script lang="ts">
    import { clickOutside } from "@/util/click-outside";
    import IconChevronDown from "@/components/icons/IconChevronDown.svelte";

    export let value;
    export let items;
    export let placeholder;

    let isShown = false;
    let refBtn;
    let ref;

    const toggleDropdown = () => {
        isShown = !isShown;
    };

    const handleOutClick = (e) => {
        if (e.detail === ref && e.explicitOriginalTarget !== refBtn) {
            isShown = false;
        }
    };

    const clickValue = (newVal) => {
        value = newVal;
        isShown = false;
    };
</script>

<div class="relative inline-block">
    <button
        bind:this={refBtn}
        class="mb-1 flex w-full cursor-pointer justify-between border-b border-gray-400 bg-transparent px-0.5 px-2 text-left placeholder-gray-200"
        on:click={toggleDropdown}
    >
        {value?.label ?? placeholder}
        <IconChevronDown />
    </button>

    {#if isShown}
        <div
            bind:this={ref}
            use:clickOutside
            on:outclick={handleOutClick}
            class="glass absolute top-full left-0 z-10 mt-1 w-full rounded-md shadow-lg"
        >
            <div class="m-2 flex flex-col items-start gap-0.5 text-white">
                {#each items as item}
                    <button
                        class="w-full rounded-md px-2 py-2 text-left transition-all hover:bg-white/10"
                        on:click={() => clickValue(item)}
                    >
                        {item.label}
                    </button>
                {/each}
            </div>
        </div>
    {/if}
</div>
