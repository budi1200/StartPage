<script lang="ts">
    import { quoteForSlot, readwise } from "@/api/readwise.svelte";

    const quote = $derived(quoteForSlot(readwise.quotes, readwise.slot + readwise.skip));
</script>

{#if quote}
    <figure
        id="quote"
        class="absolute top-16 right-16 hidden max-w-xl text-right text-2xl leading-relaxed text-white xl:block"
    >
        {#each quote.split(/\n\s*\n+/) as paragraph}
            <p>{paragraph}</p>
        {/each}
    </figure>
{/if}

<style>
    figure {
        text-shadow: 0 1px 12px rgb(0 0 0 / 0.35);
        white-space: pre-line;
        text-wrap: pretty;
    }

    p {
        font-family: Georgia, "Iowan Old Style", Charter, "Times New Roman", serif;
        font-style: italic;
    }

    p + p {
        margin-top: 0.5em;
    }
</style>
