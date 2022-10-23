<script lang="ts">
    import {clickOutside} from "@/util/click-outside";
    import {fade, fly} from "svelte/transition";

    export let title: string;
    export let actionText: string;
    export let onAction: () => void;
    export let isActionPending = false;
    let isOpen = false;

    export const openModal = () => {
        isOpen = true;
    };

    export const closeModal = () => {
        isOpen = false;
    };
</script>

{#if isOpen}
    <div
        class="fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto text-white flex justify-center items-center z-40 bg-gray-400/20"
        transition:fade={{ duration: 200 }}
    >
        <div
            class="container relative w-auto pointer-events-none"
            use:clickOutside
            on:outclick={closeModal}
            in:fly={{ y: -100, duration: 200 }}
            out:fly={{ y: -100, duration: 200 }}
        >
            <div
                class="border-none shadow-lg relative flex flex-col w-full pointer-events-auto glass bg-clip-padding rounded-md outline-none text-current"
            >
                <!-- Modal header -->
                <div
                    class="flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200/20 rounded-t-md"
                >
                    <h5 class="text-xl font-medium leading-normal">
                        {title}
                    </h5>
                    <button
                        type="button"
                        class="w-4 h-4 p-1 flex justify-center items-center border-none rounded-none focus:shadow-none focus:outline-none hover:text-black hover:no-underline"
                        on:click={closeModal}
                    >
                        <span class="material-icons-outlined text-white">close</span>
                    </button>
                </div>

                <!-- Modal content -->
                <div class="relative p-4">
                    <slot/>
                </div>

                <!-- Modal action buttons -->
                <div
                    class="flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200/20 rounded-b-md"
                >
                    <button
                        type="button"
                        data-mdb-ripple="true"
                        data-mdb-ripple-color="light"
                        class="inline-block px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
                        on:click={closeModal}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-1 disabled:bg-gray-400"
                        on:click={onAction}
                        disabled={isActionPending}
                    >
                        {#if isActionPending}
                            <div
                                class="spinner-border animate-spin inline-block w-3 h-3 mx-2 border-2 rounded-full text-gray-300"
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
