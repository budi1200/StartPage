<script lang="ts">
    export let title: string;
    export let subtitle: string;
</script>

<div
    class={`card flex h-12 transform-gpu items-center rounded-md px-2 transition-all duration-200 ease-in-out hover:bg-hoverGrey ${$$props.class}`}
    on:click
>
    <div class="m-3 flex h-4 w-4 min-w-4 items-center justify-center">
        <slot name="icon" />
    </div>

    <div>
        <h4 class="translate-y-2 transform-gpu text-base transition-all duration-200 ease-in-out">
            {title}
        </h4>
        <span
            class="flex h-4 -translate-y-4 transform-gpu overflow-hidden break-all text-xxs opacity-0 transition-all duration-200 ease-in-out"
        >
            {subtitle}
        </span>
    </div>
</div>

<style lang="postcss">
    .card:hover {
        box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034), 0 6.7px 5.3px rgba(0, 0, 0, 0.048);
    }

    .card:hover h4 {
        @apply translate-y-0.5;
    }

    .card:hover span {
        @apply -translate-y-0.5 opacity-80;
    }
</style>
