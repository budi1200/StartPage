<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        title,
        subtitle,
        class: className = "",
        onclick,
        icon,
    }: { title: string; subtitle: string; class?: string; onclick?: () => void; icon: Snippet } = $props();
</script>

<div
    class={`group flex h-12 transform-gpu items-center rounded-md px-2 transition-all duration-200 ease-in-out hover:bg-hoverGrey hover:shadow-hoverOutline ${className}`}
    role="button"
    tabindex="-1"
    {onclick}
    onkeypress={() => {}}
>
    <div class="m-3 flex h-4 w-4 min-w-4 items-center justify-center">
        {@render icon()}
    </div>

    <div>
        <h4
            class="translate-y-2 transform-gpu text-base transition-all duration-200 ease-in-out group-hover:translate-y-0.5"
        >
            {title}
        </h4>
        <span
            class="flex h-4 -translate-y-4 transform-gpu overflow-hidden text-xxs break-all opacity-0 transition-all duration-200 ease-in-out group-hover:-translate-y-0.5 group-hover:opacity-80"
        >
            {subtitle}
        </span>
    </div>
</div>
