<script lang="ts">
    import {type IBookmark} from "@/types";
    import FancyCard from "@/components/elements/FancyCard.svelte";
    import {getFaviconUrl} from "@/util/favicon-helper";

    export let bookmarkData: IBookmark;
    let urlObj;

    $: urlObj = new URL(bookmarkData.url)
</script>

<a href={bookmarkData.url} class="w-full">
    <FancyCard
        title={bookmarkData.label}
        subtitle={urlObj.href.replace(/https?:\/\//i, "").replace(/\/+$/, "")}
    >
        <img slot="icon" class="w-4 h-4" src={getFaviconUrl(bookmarkData.iconType, urlObj.host)} alt="" loading="lazy" decoding="async"/>
    </FancyCard>
</a>

