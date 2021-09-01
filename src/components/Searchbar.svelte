<script>
    // @ts-nocheck

    import { createEventDispatcher } from "svelte";

    export let isEditing;

    const dispatch = createEventDispatcher();
</script>

<div id="SearchBox" class="flex relative  mb-8">
    <img
        id="SearchBoxIcon"
        class="filter invert absolute left-4 top-3 z-10 select-none"
        style="user-drag: false"
        width="24"
        src="/assets/images/ico-google.png"
        alt="Google"
        draggable="false"
        ondragstart="return false;"
    />

    <div
        id="searchbar"
        class="blur max-w-lg px-2 py-3 rounded-md glass w-2/5 transition-all duration-200"
    >
        <input
            id="search_Input"
            class="bg-none text-white bg-transparent outline-none w-full"
            type="text"
        />
    </div>
</div>

<style>
    #search_Input {
        text-indent: 35px;
    }

    #searchbar:hover {
        background-color: rgba(27, 26, 27, 0.645);
        box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034), 0 6.7px 5.3px rgba(0, 0, 0, 0.048);
    }
</style>
