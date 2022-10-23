<script lang="ts">
    export let title: string;
    export let icon: string;
</script>

<button
    on:click
    title={title}
    class="flex glass p-2 rounded-md hover:bg-hoverGrey hover:shadow-hoverOutline"
>
    <span class="material-icons-outlined !text-sm !leading-none">{icon}</span>
</button>