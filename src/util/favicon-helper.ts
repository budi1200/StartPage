import { IconType } from "@/types";

export const getFaviconUrl = (type: IconType, domain: string) => {
    let url = null;

    switch (type) {
        case IconType.GOOGLE:
            // url = `https://www.google.com/s2/favicons?sz=192&domain_url=${domain}`;
            url = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=192`;
            break;
        case IconType.DUCKDUCKGO:
            url = `https://external-content.duckduckgo.com/ip3/${domain}.ico`;
            break;
        case IconType.CUSTOM:
            url = domain;
            break;
    }

    return url;
};

export const iconTypes = Object.entries(IconType).map(([key, value]) => ({
    value,
    label: key[0].toUpperCase() + key.slice(1).toLowerCase(),
}));

export const getFaviconPreviewUrl = (
    bookmarkUrl: string | undefined,
    selectedIconType: IconType | undefined,
    customUrl: string | undefined,
) => {
    if (!bookmarkUrl || selectedIconType === undefined) return null;
    if (selectedIconType === IconType.CUSTOM && customUrl) return getFaviconUrl(selectedIconType, customUrl);

    try {
        let tempUrl = new URL(bookmarkUrl);
        return getFaviconUrl(selectedIconType, tempUrl.host);
    } catch (e) {
        console.trace(e);
        return null;
    }
};

export const safeParseUrl = (url: string): URL | null => {
    try {
        return new URL(url);
    } catch (err) {
        return null;
    }
};
