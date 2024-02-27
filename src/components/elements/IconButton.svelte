<script lang="ts">
    let { title, onclick } = $props<{ title: string; onclick: any }>();
</script>

<button {onclick} {title} class="glass flex rounded-md p-2 text-sm hover:bg-hoverGrey hover:shadow-hoverOutline">
    <slot />
</button>
