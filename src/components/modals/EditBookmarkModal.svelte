<script lang="ts">
    import Input from "@/components/elements/Input.svelte";
    import { getFaviconPreviewUrl, iconTypes, safeParseUrl } from "@/util/favicon-helper";
    import { type IBookmark, IconType } from "@/types";
    import InputSelect from "@/components/elements/InputSelect.svelte";

    export const openModal = () => {
        modalComponent?.showModal();
    };

    const closeModal = () => {
        modalComponent?.close();
        bookmarkName = bookmark?.title;
        bookmarkUrl = bookmark?.url;
        selectedIconType = bookmark.iconType;
        customUrl = bookmark.iconType === IconType.CUSTOM ? bookmark.host : "";
    };

    let { bookmark } = $props<{ bookmark: IBookmark }>();
    let modalComponent = $state<HTMLDialogElement>();

    let bookmarkName = $state<string>(bookmark?.title);
    let bookmarkUrl = $state<string>(bookmark?.url);
    let selectedIconType = $state<IconType>(bookmark.iconType);
    let customUrl = $state<string>(bookmark.iconType === IconType.CUSTOM ? bookmark.host : "");

    const iconPreviewUrl = $derived.by(() => getFaviconPreviewUrl(bookmarkUrl, selectedIconType, customUrl));

    const editBookmark = (e: SubmitEvent) => {
        if (!bookmarkName || !bookmarkUrl || !selectedIconType) {
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

        // Update bookmark data
        bookmark.title = bookmarkName;
        bookmark.subtitle = urlObj.href.replace(/https?:\/\//i, "").replace(/\/$/, "");
        bookmark.url = bookmarkUrl;
        bookmark.iconType = selectedIconType;
        bookmark.host = selectedIconType === IconType.CUSTOM ? customUrl! : urlObj.host;
    };
</script>

<dialog bind:this={modalComponent} onsubmit={editBookmark} class="bg-transparent">
    <form
        method="dialog"
        class="glass relative flex w-full flex-col rounded-md border-none bg-clip-padding p-4 text-white shadow-lg outline-none"
    >
        <h5 class="mb-4 text-xl font-medium">New bookmark</h5>

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

        <div class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t border-gray-200/20 p-4">
            <button
                type="button"
                class="inline-block rounded border border-white/20 px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-white/20 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:bg-white/10 active:shadow-lg"
                onclick={closeModal}
            >
                Cancel
            </button>

            <button
                type="submit"
                class="ml-1 inline-block rounded border border-white/20 bg-hoverGrey px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-gray-600 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg disabled:bg-gray-400"
            >
                Save
            </button>
        </div>
    </form>
</dialog>
