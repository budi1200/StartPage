<script lang="ts">
    let { placeholder, value } = $props<{ placeholder: string; value: any }>();
</script>

<input
    type="text"
    bind:value
    {placeholder}
    class="mb-1 border-b border-gray-400 bg-transparent px-0.5 placeholder-gray-200"
/>
