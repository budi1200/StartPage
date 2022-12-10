<script lang="ts">
    export let placeholder: string;
    export let value;
</script>

<input type="text" bind:value {placeholder} class="mb-1 border-b border-gray-400 bg-transparent placeholder-gray-200" />
