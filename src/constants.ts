import { IconType, type IStartPageData } from "@/types";

export const DRIVE_FILES_URL = `https://www.googleapis.com/drive/v3/files`;
export const DRIVE_UPLOAD_URL = `https://www.googleapis.com/upload/drive/v3/files`;

// Google stuff
export const CLIENT_ID = "15939700739-sa3ojuvchrq30sepr3uudj4p9kbm3ts1.apps.googleusercontent.com";
export const SCOPES = "https://www.googleapis.com/auth/drive.appdata";
export const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth?";

export const LOCAL_KEY = "startpage-categories";

export const defaultPageData: IStartPageData = {
    categories: [
        {
            id: "kptfyh1dru0otxw72a",
            label: "Social Media",
            bookmarks: [
                {
                    id: "kptfyih4jyxljaf6z4o",
                    title: "Facebook",
                    subtitle: "facebook.com",
                    url: "https://www.facebook.com",
                    host: "facebook.com",
                    iconType: IconType.DUCKDUCKGO,
                },
                {
                    id: "kptfyx0taoar2eenjjj",
                    title: "Messenger",
                    subtitle: "www.messenger.com",
                    url: "https://www.messenger.com",
                    host: "www.messenger.com",
                    iconType: IconType.DUCKDUCKGO,
                },
                {
                    id: "kptfyxj50cq9zdazwbi7",
                    title: "Instagram",
                    subtitle: "www.instagram.com",
                    url: "https://www.instagram.com",
                    host: "www.instagram.com",
                    iconType: IconType.DUCKDUCKGO,
                },
                {
                    id: "kptfyxwt40s3p1ppd7",
                    title: "Reddit",
                    subtitle: "www.reddit.com",
                    url: "https://www.reddit.com",
                    host: "www.reddit.com",
                    iconType: IconType.DUCKDUCKGO,
                },
                {
                    id: "kptfyyanz7j0ugg9ua",
                    title: "X",
                    subtitle: "x.com",
                    url: "https://x.com",
                    host: "x.com",
                    iconType: IconType.DUCKDUCKGO,
                },
            ],
        },
        {
            id: "kptfyhayai33ejo073a",
            label: "Entertainment",
            bookmarks: [
                {
                    id: "kptfzcgrhcx2aicwyxj",
                    title: "YouTube",
                    subtitle: "www.youtube.com",
                    url: "https://www.youtube.com",
                    host: "www.youtube.com",
                    iconType: IconType.DUCKDUCKGO,
                },
                {
                    id: "kptfzg3670uhwkxfei",
                    title: "GitHub",
                    subtitle: "www.github.com",
                    url: "https://www.github.com",
                    host: "www.github.com",
                    iconType: IconType.DUCKDUCKGO,
                },
                {
                    id: "kptfzjrnked0b3pmupb",
                    title: "Star Trek",
                    subtitle: "www.startrek.com",
                    url: "https://www.startrek.com/en-un",
                    host: "www.startrek.com",
                    iconType: IconType.DUCKDUCKGO,
                },
            ],
        },
    ],
};
