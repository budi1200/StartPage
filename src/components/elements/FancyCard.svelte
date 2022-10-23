<script lang="ts">
    export let title: string;
    export let subtitle: string;
</script>

<div
    class={`card flex items-center h-12 transform-gpu transition-all ease-in-out duration-200 rounded-md px-2 hover:bg-hoverGrey ${$$props.class}`}
    on:click
>
    <div class="w-4 h-4 m-3 min-w-4 flex justify-center items-center">
        <slot name="icon"/>
    </div>

    <div>
        <h4 class="text-base translate-y-2 transform-gpu transition-all ease-in-out duration-200">
            {title}
        </h4>
        <span
            class="flex text-xxs opacity-0 h-4 -translate-y-4 transform-gpu transition-all ease-in-out duration-200 overflow-hidden break-all"
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
        @apply opacity-80 -translate-y-0.5;
    }
</style>