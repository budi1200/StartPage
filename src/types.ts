export interface IBookmark {
    id: string;
    label: string;
    url: string;
    iconType: IconType;
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
    DUCKDUCKGO,
    GOOGLE,
    CUSTOM
}