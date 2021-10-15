<script>

    import { onMount, createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher()

    export let src;
    export let libraryDetectionObject;
    let script;

    onMount(() => {
        if (
            libraryDetectionObject &&
            window &&
            typeof window[libraryDetectionObject] !== "undefined"
        ) {
            return;
        }
        script.addEventListener("load", () => {
            dispatch("loaded")
        });
        script.addEventListener("error", (event) => {
            console.error("something went wrong", event);
        });
    });
</script>

<svelte:head>
    <script async defer bind:this={script} {src}>
    </script>
</svelte:head>