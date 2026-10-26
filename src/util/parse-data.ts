import { IconType, type IBookmark, type ICategory, type IStartPageData } from "@/types";

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

const isString = (value: unknown): value is string => typeof value === "string";

const isIconType = (value: unknown): value is IconType => Object.values<unknown>(IconType).includes(value);

const isBookmark = (value: unknown): value is IBookmark =>
    isRecord(value) &&
    isString(value.id) &&
    isString(value.title) &&
    isString(value.subtitle) &&
    isString(value.url) &&
    isString(value.host) &&
    isIconType(value.iconType);

const isCategory = (value: unknown): value is ICategory =>
    isRecord(value) &&
    isString(value.id) &&
    isString(value.label) &&
    Array.isArray(value.bookmarks) &&
    value.bookmarks.every(isBookmark);

export const parseStartPageData = (value: unknown): IStartPageData | null => {
    if (!isRecord(value) || !Array.isArray(value.categories) || !value.categories.every(isCategory)) return null;
    return { categories: value.categories };
};

export const parseStartPageJson = (json: string): IStartPageData | null => {
    try {
        return parseStartPageData(JSON.parse(json));
    } catch {
        return null;
    }
};
