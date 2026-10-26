<script lang="ts">
    import Clock from "./components/Clock.svelte";
    import CategoriesWrapper from "./components/CategoriesWrapper.svelte";

    // TODO: Toast notifications for actions
</script>

<svelte:head>
    <style>
        @font-face {
            font-family: "Manrope";
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url("/assets/fonts/Manrope-Regular.woff2");
        }
    </style>

    {#if import.meta.env.DEV}
        <title>Dev StartPage</title>
    {/if}
</svelte:head>

<div class="fixed top-0 left-0 -z-1 h-full w-full bg-[url('/assets/images/bg/9490e8fu9oi61.webp')] bg-cover"></div>

<div class="container mx-auto px-6 pt-36 pb-32 text-white">
    <Clock />
    <CategoriesWrapper />
</div>
