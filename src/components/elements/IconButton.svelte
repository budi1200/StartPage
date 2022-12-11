<script lang="ts">
    export let title: string;
</script>

<button on:click {title} class="glass flex rounded-md p-2 hover:bg-hoverGrey hover:shadow-hoverOutline">
    <slot />
</button>
