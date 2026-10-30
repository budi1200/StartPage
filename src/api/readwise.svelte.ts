const TOKEN_KEY = "startpage-readwise-token";
const CACHE_KEY = "startpage-readwise-quotes";
const QUOTE_TAG = "quotes-cycle";
const MAX_PAGES = 50;
const HOUR_MS = 3_600_000;
const SLOT_MS = 2 * HOUR_MS;
const FIRST_SWITCH_HOUR = 2;

type QuoteCache = { slot: number; quotes: string[]; skip: number };
type HighlightsPage = { next: string | null; results: { text: string; tags?: { name: string }[] }[] };

const localMs = (date: Date) => date.getTime() - date.getTimezoneOffset() * 60_000;

export function currentSlot(now = new Date()) {
    return Math.floor((localMs(now) - FIRST_SWITCH_HOUR * HOUR_MS) / SLOT_MS);
}

export const readwise = $state({ quotes: [] as string[], skip: 0, slot: currentSlot() });

export function quoteForSlot(list: string[], slot: number) {
    if (!list.length) return null;

    const shuffled = list.slice();
    let seed = 0x9e3779b9;
    const rand = () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const index = ((slot % shuffled.length) + shuffled.length) % shuffled.length;
    return shuffled[index];
}

const stripBlockquoteMarkers = (text: string) => text.replace(/^[ \t]*>+[ \t]?/gm, "");

async function fetchQuotes(token: string) {
    const found: string[] = [];

    for (let page = 1; page <= MAX_PAGES; page++) {
        const url = `https://readwise.io/api/v2/highlights/?page_size=1000&page=${page}`;
        const response = await fetch(url, { headers: { Authorization: `Token ${token}` } });
        if (response.status === 429) {
            throw new Error(`Readwise rate limited (retry after ${response.headers.get("Retry-After") ?? "?"}s)`);
        }
        if (!response.ok) throw new Error(`Readwise responded ${response.status}`);

        const data = (await response.json()) as HighlightsPage;
        for (const highlight of data.results) {
            const isTagged = highlight.tags?.some((tag) => tag.name.toLowerCase() === QUOTE_TAG);
            const text = stripBlockquoteMarkers(highlight.text).trim();
            if (isTagged && text) found.push(text);
        }
        if (!data.next) break;
    }

    return found;
}

function readCache(): QuoteCache | null {
    try {
        const cache = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "null");
        const isValid =
            typeof cache?.slot === "number" &&
            Array.isArray(cache.quotes) &&
            cache.quotes.every((quote: unknown) => typeof quote === "string");
        return isValid ? { ...cache, skip: Number.isInteger(cache.skip) ? cache.skip : 0 } : null;
    } catch {
        return null;
    }
}

async function refreshQuotes(token: string) {
    const slot = currentSlot();
    // Recorded before fetching so a failing Readwise is retried once per slot, not on every new tab.
    writeCache({ slot, quotes: readwise.quotes, skip: readwise.skip });

    const fetched = await fetchQuotes(token);
    writeCache({ slot, quotes: fetched, skip: readwise.skip });
    readwise.quotes = fetched;
}

function writeCache(cache: QuoteCache) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

const refreshInBackground = (token: string) =>
    refreshQuotes(token).catch((err) => console.warn("Readwise sync failed", err));

export function loadQuotes() {
    scheduleSlotSwitch();

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    const cache = readCache();
    readwise.quotes = cache?.quotes ?? [];
    readwise.skip = cache?.skip ?? 0;
    if (cache?.slot === readwise.slot) return;

    new PerformanceObserver((entries, observer) => {
        if (!entries.getEntriesByName("first-contentful-paint").length) return;
        observer.disconnect();
        refreshInBackground(token);
    }).observe({ type: "paint", buffered: true });
}

function scheduleSlotSwitch() {
    const now = new Date();
    const nextSwitchLocalMs = (currentSlot(now) + 1) * SLOT_MS + FIRST_SWITCH_HOUR * HOUR_MS;
    setTimeout(
        () => {
            switchSlotIfDue();
            scheduleSlotSwitch();
        },
        nextSwitchLocalMs - localMs(now),
    );
}

function switchSlotIfDue() {
    const slot = currentSlot();
    if (slot === readwise.slot) return;
    readwise.slot = slot;

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    const cache = readCache();
    if (cache?.slot !== slot) {
        refreshInBackground(token);
        return;
    }
    readwise.quotes = cache.quotes;
    readwise.skip = cache.skip;
}

export async function configureReadwise() {
    const token = prompt("Readwise access token (leave empty to remove)")?.trim();
    if (token === undefined) return;

    if (!token) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(CACHE_KEY);
        readwise.quotes = [];
        readwise.skip = 0;
        return;
    }

    localStorage.setItem(TOKEN_KEY, token);
    await refreshOrAlert(token);
}

export async function showNextQuote() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    readwise.skip++;
    await refreshOrAlert(token);
}

async function refreshOrAlert(token: string) {
    try {
        await refreshQuotes(token);
    } catch (err) {
        alert(`Readwise sync failed: ${err instanceof Error ? err.message : err}`);
    }
}
