<script lang="ts">
    import Clock from "./components/Clock.svelte";
    import CategoriesWrapper from "./components/CategoriesWrapper.svelte";

    // TODO: Toast notifications for actions
</script>

<svelte:head>
    {#if import.meta.env.DEV}
        <title>Dev StartPage</title>
    {/if}
</svelte:head>

<div class="container mx-auto px-6 pt-36 pb-32 text-white">
    <Clock />
    <CategoriesWrapper />
</div>
