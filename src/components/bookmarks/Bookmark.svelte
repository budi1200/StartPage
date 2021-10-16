<script lang="ts">
    export let id: string
    export let label: string;
    export let url: string;
    export let alt: boolean = false;

    let displayUrl = (url ?? url).replace(/^https?:\/\//g, "");
    let favUrl = displayUrl.split("/")[0];
    if (displayUrl.length > 25) {
        displayUrl = displayUrl.slice(0, 31);
    }

    let grabber = `https://external-content.duckduckgo.com/ip3/${favUrl}.ico`;
    let altGrabber = `https://www.google.com/s2/favicons?sz=192&domain_url=${favUrl}`;
</script>

<a href={url}>
    <div class="bookmark grid px-2">
        <div class="bookmark-icon">
            <img
                height="16"
                width="16"
                src={alt ? altGrabber : grabber}
                alt=""
                loading="lazy"
                decoding="async"
            />
        </div>

        <div class="bookmark-info">
            <div class="bookmark-info-label">{label}</div>
            <div class="bookmark-info-url">{displayUrl}</div>
        </div>
    </div>
</a>

<style lang="postcss">
    .bookmark {
        @apply grid grid-cols-42 py-1 text-white;

        min-height: 50px;
        grid-template-columns: 42px 1fr;
    }

    .bookmark-icon {
        @apply flex items-center justify-center;
    }

    .bookmark-info-label {
        @apply text-base transform-gpu translate-y-191 transition-transform duration-200 ease-in-out;
        backface-visibility: hidden;
    }

    .bookmark-info-url {
        @apply transform-gpu translate-y-192 text-xxs opacity-0 transition-all duration-200 ease-in-out;
        backface-visibility: hidden;
    }

    .bookmark:hover {
        box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034), 0 6.7px 5.3px rgba(0, 0, 0, 0.048);

        background-color: rgba(27, 26, 27, 0.445);
        border-radius: 5px;
    }

    .bookmark:hover .bookmark-info-label {
        -webkit-font-smoothing: subpixel-antialiased;
        transform: translateY(3px);
    }

    .bookmark:hover .bookmark-info-url {
        @apply translate-y-0 opacity-80;
    }
</style>
