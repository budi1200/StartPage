<script lang="ts">
    import Input from "@/components/elements/Input.svelte";
    import InputSelect from "@/components/elements/InputSelect.svelte";
    import { getFaviconPreviewUrl, iconTypes, safeParseUrl } from "@/util/favicon-helper";
    import { type IBookmark, IconType } from "@/types";

    let { title, bookmark, onsave }: { title: string; bookmark?: IBookmark; onsave: (bookmark: IBookmark) => void } =
        $props();

    let modalComponent = $state<HTMLDialogElement>();
    let bookmarkName = $state<string>();
    let bookmarkUrl = $state<string>();
    let selectedIconType = $state<IconType>(IconType.DUCKDUCKGO);
    let customUrl = $state<string>();

    const iconPreviewUrl = $derived(getFaviconPreviewUrl(bookmarkUrl, selectedIconType, customUrl));

    export const openModal = () => {
        bookmarkName = bookmark?.title;
        bookmarkUrl = bookmark?.url;
        selectedIconType = bookmark?.iconType ?? IconType.DUCKDUCKGO;
        customUrl = bookmark?.iconType === IconType.CUSTOM ? bookmark.host : undefined;
        modalComponent?.showModal();
    };

    const save = (e: SubmitEvent) => {
        if (!bookmarkName || !bookmarkUrl) {
            e.preventDefault();
            alert("Please fill all fields");
            return;
        }

        const urlObj = safeParseUrl(bookmarkUrl);
        if (urlObj == null) {
            e.preventDefault();
            alert("Invalid URL");
            return;
        }

        onsave({
            id: bookmark?.id ?? crypto.randomUUID(),
            title: bookmarkName,
            subtitle: urlObj.href.replace(/https?:\/\//i, "").replace(/\/$/, ""),
            url: bookmarkUrl,
            iconType: selectedIconType,
            host: selectedIconType === IconType.CUSTOM ? customUrl! : urlObj.host,
        });
    };
</script>

<dialog bind:this={modalComponent} onsubmit={save} class="m-auto bg-transparent">
    <form
        method="dialog"
        class="glass relative flex w-full flex-col rounded-md border-none bg-clip-padding p-4 text-white shadow-lg outline-hidden"
    >
        <h5 class="mb-4 text-xl font-medium">{title}</h5>

        <div class="mb-4 flex w-72 flex-col gap-4">
            <Input placeholder="Name" bind:value={bookmarkName} />
            <Input placeholder="Url" bind:value={bookmarkUrl} />
            <InputSelect items={iconTypes} bind:value={selectedIconType} />
            {#if selectedIconType === IconType.CUSTOM}
                <Input placeholder="Custom Icon" bind:value={customUrl} />
            {/if}

            <div class="flex h-12 flex-col items-center justify-center">
                <img src={iconPreviewUrl} alt="" />
            </div>
        </div>

        <div class="flex shrink-0 flex-wrap items-center justify-end rounded-b-md border-t border-gray-200/20 p-4">
            <button
                type="button"
                class="inline-block rounded-sm border border-white/20 px-6 py-2.5 text-xs leading-tight font-medium text-white uppercase shadow-md transition duration-150 ease-in-out hover:bg-white/20 hover:shadow-lg focus:shadow-lg focus:ring-0 focus:outline-hidden active:bg-white/10 active:shadow-lg"
                onclick={() => modalComponent?.close()}
            >
                Cancel
            </button>

            <button
                type="submit"
                class="ml-1 inline-block rounded-sm border border-white/20 bg-hoverGrey px-6 py-2.5 text-xs leading-tight font-medium text-white uppercase shadow-md transition duration-150 ease-in-out hover:bg-gray-600 hover:shadow-lg focus:shadow-lg focus:ring-0 focus:outline-hidden active:bg-blue-800 active:shadow-lg disabled:bg-gray-400"
            >
                Save
            </button>
        </div>
    </form>
</dialog>
