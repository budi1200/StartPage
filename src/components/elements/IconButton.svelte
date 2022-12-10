<script lang="ts">
    export let title: string;
    export let icon: string;
</script>

<button on:click {title} class="glass flex rounded-md p-2 hover:bg-hoverGrey hover:shadow-hoverOutline">
    <span class="material-icons-outlined !text-sm !leading-none">{icon}</span>
</button>
