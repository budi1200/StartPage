<script lang="ts">
    import { clickOutside } from "@/util/click-outside";
    import { fade, fly } from "svelte/transition";
    import IconClose from "@/components/icons/IconClose.svelte";

    export let title: string;
    export let actionText: string;
    export let onAction: () => void;
    export let isActionPending = false;
    let isOpen = false;
    let ref;

    export const openModal = () => {
        isOpen = true;
    };

    export const closeModal = () => {
        isOpen = false;
    };

    const clickOutsideHandler = (e) => {
        if (e.detail === ref) {
            isOpen = false;
        }
    };
</script>

{#if isOpen}
    <div
        class="fixed top-0 left-0 z-40 flex h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-400/20 text-white outline-none"
        transition:fade={{ duration: 200 }}
    >
        <div
            class="container pointer-events-none relative w-auto"
            bind:this={ref}
            use:clickOutside
            on:outclick={clickOutsideHandler}
            in:fly={{ y: -100, duration: 200 }}
            out:fly={{ y: -100, duration: 200 }}
        >
            <div
                class="glass pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-clip-padding text-current shadow-lg outline-none"
            >
                <!-- Modal header -->
                <div
                    class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b border-gray-200/20 p-4"
                >
                    <h5 class="text-xl font-medium leading-normal">
                        {title}
                    </h5>
                    <button
                        type="button"
                        class="flex h-6 w-6 items-center justify-center rounded-none border-none transition-all hover:text-gray-400 hover:no-underline focus:shadow-none focus:outline-none"
                        on:click={closeModal}
                    >
                        <IconClose />
                    </button>
                </div>

                <!-- Modal content -->
                <div class="relative p-4">
                    <slot />
                </div>

                <!-- Modal action buttons -->
                <div
                    class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t border-gray-200/20 p-4"
                >
                    <button
                        type="button"
                        class="inline-block rounded border border-white/20 px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-white/20 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:bg-white/10 active:shadow-lg"
                        on:click={closeModal}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        class="ml-1 inline-block rounded border border-white/20 bg-hoverGrey px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-gray-600 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg disabled:bg-gray-400"
                        on:click={onAction}
                        disabled={isActionPending}
                    >
                        {#if isActionPending}
                            <div
                                class="spinner-border mx-2 inline-block h-3 w-3 animate-spin rounded-full border-2 text-gray-300"
                            >
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        {:else}
                            {actionText}
                        {/if}
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}
