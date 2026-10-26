<script lang="ts">
    let { placeholder, value = $bindable() }: { placeholder: string; value?: string } = $props();
</script>

<input
    type="text"
    bind:value
    {placeholder}
    class="mb-1 w-full border-b border-gray-400 bg-transparent px-0.5 placeholder-gray-200"
/>
