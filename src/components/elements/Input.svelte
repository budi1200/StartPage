<script lang="ts">
    export let placeholder: string;
    export let value
</script>

<input
    type="text"
    bind:value={value}
    {placeholder}
    class="mb-1 bg-transparent placeholder-gray-200 border-b border-gray-400"
/>