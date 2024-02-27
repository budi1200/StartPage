export interface IBookmark {
    id: string;
    title: string;
    subtitle: string;
    url: string;
    iconType: IconType;
    host: string;
}

export interface ICategory {
    id: string;
    label: string;
    bookmarks: IBookmark[];
}

export interface IStartPageData {
    categories: ICategory[];
}

export enum IconType {
    DUCKDUCKGO = "duckduckgo",
    GOOGLE = "google",
    CUSTOM = "custom",
}
