<script lang="ts">
    import Clock from "./components/Clock.svelte";
    import CategoriesWrapper from "./components/CategoriesWrapper.svelte";
    import { onMount } from "svelte";
    import { loadLocalData } from "@/util/data-manager";

    onMount(() => {
        loadLocalData();
    });

    // TODO: Toast notifications for actions
    // TODO: Bookmark editing
    // TODO: Bookmark & Category reordering
    // TODO: Check if Drive version is different from local
</script>

<svelte:head>
    <!--suppress CssUnknownTarget -->
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

<div class="-z-1 fixed top-0 left-0 h-full w-full bg-[url('/assets/images/bg/9490e8fu9oi61.webp')] bg-cover" />

<div class="container mx-auto px-6 pt-36 pb-32 text-white">
    <Clock />
    <CategoriesWrapper />
</div>
