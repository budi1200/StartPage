import {IconType} from "@/types";

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
            url = "TODO";
            break;
    }

    return url;
}