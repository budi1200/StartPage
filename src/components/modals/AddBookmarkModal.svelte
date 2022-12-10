<script lang="ts">
    import ModalWrapper from "@/components/elements/ModalWindow.svelte";
    import Input from "@/components/elements/Input.svelte";
    import Select from "svelte-select";
    import { getFaviconUrl } from "@/util/favicon-helper";
    import type { IBookmark, ICategory } from "@/types";
    import { IconType } from "@/types";
    import { v4 as uuidv4 } from "uuid";

    export const openModal = () => {
        // noinspection TypeScriptUnresolvedFunction
        modalComponent.openModal();
    };

    export let category: ICategory;
    let modalComponent: ModalWrapper;
    let isLoading = false;

    let bookmarkName: string;
    let bookmarkUrl: string;
    let selectedIconType = null;

    let iconPreviewUrl = null;
    let iconTypes = Object.keys(IconType)
        .filter((v) => isNaN(Number(v)))
        .map((ico, index) => {
            const lower = ico.toLowerCase();
            return {
                value: index,
                label: lower[0].toUpperCase() + lower.slice(1),
            };
        });

    const updateIconPreview = (selectedIco, url) => {
        if (url == "" || url == undefined) return;

        try {
            let tempUrl = new URL(url);

            iconPreviewUrl = getFaviconUrl(IconType[IconType[selectedIco.value]], tempUrl.host);
        } catch (e) {}
    };

    const addBookmark = () => {
        let newBookmark: IBookmark = {
            id: uuidv4(),
            label: bookmarkName,
            url: bookmarkUrl,
            iconType: IconType[IconType[selectedIconType.value]],
        };

        category.bookmarks = [...category.bookmarks, newBookmark];
        // noinspection TypeScriptUnresolvedFunction
        modalComponent.closeModal();
    };

    $: updateIconPreview(selectedIconType, bookmarkUrl);
</script>

<ModalWrapper
    bind:this={modalComponent}
    title={`New Bookmark`}
    onAction={addBookmark}
    actionText="Save"
    isActionPending={isLoading}
>
    <div class="mb-4 flex w-72 flex-col gap-4">
        <Input placeholder="Name" bind:value={bookmarkName} />
        <Input placeholder="Url" bind:value={bookmarkUrl} />
        <Select
            items={iconTypes}
            bind:value={selectedIconType}
            clearable={false}
            placeholder="Select icon variant"
            --background="transparent"
            --border="none"
            --border-focused="none"
            --border-hover="none"
            --border-radius="0"
            --padding="0"
            --placeholder-color="#E5E7EB"
            --list-background="white"
            --item-color="gray"
            --item-hover-color="black"
        />

        <div class="flex h-12">
            <img src={iconPreviewUrl} alt="" />
        </div>
    </div>
</ModalWrapper>

<style lang="postcss">
    :global(.svelte-select) {
        border-bottom: 1px solid #9ca3af !important;
    }
</style>
