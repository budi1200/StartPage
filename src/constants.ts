// Google Drive API Endpoints
import { IconType, type IStartPageData } from "@/types";

export const CORS_PROXY = "https://cors.pojej.se";
export const DRIVE_FILES_URL = `${CORS_PROXY}/https://www.googleapis.com/drive/v3/files`;
export const DRIVE_UPLOAD_URL = `${CORS_PROXY}/https://www.googleapis.com/upload/drive/v3/files`;

// Google stuff
export const CLIENT_ID = "15939700739-sa3ojuvchrq30sepr3uudj4p9kbm3ts1.apps.googleusercontent.com";
export const SCOPES = "https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file";
export const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth?";

export const LAST_SYNC_NAME = "startpage-lastsync";
export const LOCAL_KEY = "startpage-categories";

export const defaultPageData: IStartPageData = {
    categories: [
        {
            id: "kptfyh1dru0otxw72a",
            label: "Social Media",
            bookmarks: [
                {
                    id: "kptfyih4jyxljaf6z4o",
                    label: "Facebook",
                    url: "https://www.facebook.com",
                    iconType: IconType.DUCKDUCKGO,
                },
                {
                    id: "kptfyx0taoar2eenjjj",
                    label: "Messenger",
                    url: "https://www.messenger.com",
                    iconType: IconType.DUCKDUCKGO,
                },
                {
                    id: "kptfyxj50cq9zdazwbi7",
                    label: "Instagram",
                    url: "https://www.instagram.com",
                    iconType: IconType.DUCKDUCKGO,
                },
                {
                    id: "kptfyxwt40s3p1ppd7",
                    label: "Reddit",
                    url: "https://www.reddit.com",
                    iconType: IconType.DUCKDUCKGO,
                },
                {
                    id: "kptfyyanz7j0ugg9ua",
                    label: "Twitter",
                    url: "https://www.twitter.com",
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
                    label: "YouTube",
                    url: "https://www.youtube.com",
                    iconType: IconType.DUCKDUCKGO,
                },
                {
                    id: "kptfzg3670uhwkxfei",
                    label: "The Hub",
                    url: "https://www.github.com",
                    iconType: IconType.DUCKDUCKGO,
                },
                {
                    id: "kptfzjrnked0b3pmupb",
                    label: "South Park",
                    url: "https://www.southparkstudios.com/seasons/south-park",
                    iconType: IconType.DUCKDUCKGO,
                },
            ],
        },
    ],
};
