<script lang="ts">
    import PhCaretDown from "~icons/ph/caret-down";

    export let value: any;
    export let items: any[];
</script>

<select
    class="mb-1 flex w-full cursor-pointer justify-between border-b border-gray-400 bg-transparent px-0.5"
    bind:value
>
    {value?.label}
    <PhCaretDown />

    {#each items as item}
        <option value={item.value} class="text-black">{item.label}</option>
    {/each}
</select>
