<script lang="ts">
    import type { Snippet } from "svelte";

    let { title, onclick, children }: { title: string; onclick: () => void; children: Snippet } = $props();
</script>

<button {onclick} {title} class="glass flex rounded-md p-2 text-sm hover:bg-hoverGrey hover:shadow-hoverOutline">
    {@render children()}
</button>
