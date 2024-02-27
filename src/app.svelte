<script lang="ts">
    import Clock from "./components/Clock.svelte";
    import CategoriesWrapper from "./components/CategoriesWrapper.svelte";

    // TODO: Toast notifications for actions
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

    {#if import.meta.env.DEV}
        <title>Dev StartPage</title>
    {/if}
</svelte:head>

<div class="-z-1 fixed left-0 top-0 h-full w-full bg-[url('/assets/images/bg/9490e8fu9oi61.webp')] bg-cover" />

<div class="container mx-auto px-6 pb-32 pt-36 text-white">
    <Clock />
    <CategoriesWrapper />
</div>
