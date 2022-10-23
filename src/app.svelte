<script lang="ts">
    import Clock from "./components/Clock.svelte";
    import CategoriesWrapper from "./components/CategoriesWrapper.svelte";
    import {onMount} from "svelte";
    import {loadLocalData} from "@/util/data-manager";

    onMount(() => {
        loadLocalData()
    });

    // TODO: Toast notifications for actions
    // TODO: Bookmark editing
    // TODO: Bookmark & Category reordering
    // TODO: Check if Drive version is different from local
</script>

<svelte:head>
    <style lang="postcss">
        @font-face {
            font-family: "Manrope";
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url("/assets/fonts/Manrope-Regular.woff2");
        }
    </style>
</svelte:head>

<div class="bg-[url('/assets/images/bg/9490e8fu9oi61.webp')] fixed top-0 left-0 w-full h-full -z-1 bg-cover"></div>

<div class="container pt-36 pb-32 mx-auto px-6 text-white">
    <Clock/>
    <CategoriesWrapper/>
</div>
