<script lang="ts" generics="T">
    let { value = $bindable(), items }: { value?: T; items: { value: T; label: string }[] } = $props();
</script>

<select
    class="mb-1 flex w-full cursor-pointer justify-between border-b border-gray-400 bg-transparent px-0.5"
    bind:value
>
    {#each items as item}
        <option value={item.value} class="text-black">{item.label}</option>
    {/each}
</select>
