import { launch } from "puppeteer-core";
import { createServer } from "vite";

const appUrl = "http://localhost:5173/";

const devServer = await createServer({ server: { port: 5173, strictPort: true } });
await devServer.listen();
const browser = await launch({ channel: "chrome", defaultViewport: { width: 1400, height: 900 } });
const page = await browser.newPage();

const consoleProblems: string[] = [];
page.on("console", (message) => {
    if (!["warn", "error"].includes(message.type())) return;

    const sourceUrl = message.location().url ?? "";
    const isExternalResourceFailure =
        message.text().startsWith("Failed to load resource") && !sourceUrl.startsWith(appUrl);
    if (!isExternalResourceFailure) consoleProblems.push(`${message.text()} ${sourceUrl}`);
});
page.on("pageerror", (error) => consoleProblems.push(String(error)));

const run = async (expression: string) => {
    const result = await page.evaluate(expression);
    await Bun.sleep(150);
    return result as any;
};
let failures = 0;
const check = (ok: boolean, name: string, detail?: unknown) => {
    console.log(`${ok ? "PASS" : "FAIL"} ${name}${ok ? "" : " -> " + JSON.stringify(detail)}`);
    if (!ok) failures++;
};

const HELPERS = `
window.alerts = []; window.alert = (m) => alerts.push(m); window.promptAnswer = null; window.prompt = () => promptAnswer;
window.$ = (s) => document.querySelector(s);
window.byTitle = (t) => $('[title="' + t + '"]');
window.cardTitles = () => [...document.querySelectorAll('article')].map(a => [a.querySelector('h3 input')?.value ?? a.querySelector('h3').textContent.trim(), [...a.querySelectorAll('a h4')].map(h => h.textContent.trim())]);
window.fancy = (article, text) => [...article.querySelectorAll('h4')].find(h => h.textContent.trim() === text).closest('[role=button]');
window.typeInto = (input, value) => { input.value = value; input.dispatchEvent(new Event('input', { bubbles: true })); };
window.openDialog = () => $('dialog[open]');
window.bookmarkButtons = (article, i) => article.querySelectorAll('a')[i].parentElement.querySelectorAll('button');
`;
await page.evaluateOnNewDocument(HELPERS);
const load = async () => {
    await page.goto(appUrl);
    await page.waitForSelector("article");
};

await page.goto(appUrl);
await run("localStorage.clear()");
await load();

const initial = await run("cardTitles()");
check(initial.length === 2 && initial[0][1].length === 5, "defaults render", initial);
const t1 = await run("$('h1').textContent");
await Bun.sleep(1100);
check(t1 !== (await run("$('h1').textContent")), "clock ticks");

await run("byTitle('Edit').click()");
const first = "document.querySelectorAll('article')[0]";
await run(`fancy(${first}, 'New').click()`);
check((await run("openDialog()?.querySelector('h5').textContent")) === "New bookmark", "add modal title");
const rect = await run(
    "(() => { const r = openDialog().getBoundingClientRect(); return [Math.round(r.left), Math.round(innerWidth - r.right)]; })()",
);
check(Math.abs(rect[0] - rect[1]) <= 1, "modal centered", rect);
await run(
    "{ const inputs = openDialog().querySelectorAll('input'); typeInto(inputs[0], 'Wiki'); typeInto(inputs[1], 'https://wikipedia.org'); }",
);
await run("openDialog().querySelector('button[type=submit]').click()");
check((await run("cardTitles()"))[0][1].at(-1) === "Wiki", "bookmark added", await run("cardTitles()"));
check(!(await run("!!openDialog()")), "add modal closed");

await run(`bookmarkButtons(${first}, 0)[1].click()`);
const editState = await run(
    "[openDialog()?.querySelector('h5').textContent, openDialog()?.querySelector('input').value]",
);
check(editState[0] === "Edit bookmark" && editState[1] === "Facebook", "edit modal title and prefill", editState);
await run("typeInto(openDialog().querySelector('input'), 'Changed')");
await run("[...openDialog().querySelectorAll('button')].find(b => b.textContent.trim() === 'Cancel').click()");
check((await run("cardTitles()"))[0][1][0] === "Facebook", "cancel keeps bookmark");
await run(`bookmarkButtons(${first}, 0)[1].click()`);
check((await run("openDialog().querySelector('input').value")) === "Facebook", "reopen resets fields after cancel");
await run("typeInto(openDialog().querySelector('input'), 'FB')");
await run("openDialog().querySelector('button[type=submit]').click()");
check((await run("cardTitles()"))[0][1][0] === "FB", "bookmark edited", await run("cardTitles()"));

await run(`bookmarkButtons(${first}, 0)[0].click()`);
check(
    (await run("cardTitles()"))[0][1].slice(0, 2).join() === "Messenger,FB",
    "move bookmark down",
    await run("cardTitles()"),
);
await run(`${first}.querySelector('h3').parentElement.querySelector('button').click()`);
check(
    (await run("cardTitles()")).map((c: any) => c[0]).join() === "Entertainment,Social Media",
    "move category right",
    await run("cardTitles()"),
);

await run("byTitle('Add category').click()");
check((await run("cardTitles()")).length === 3, "category added");
await run("fancy(document.querySelectorAll('article')[2], 'Delete').click()");
check((await run("cardTitles()")).length === 2, "category deleted");

await run("byTitle('Save').click()");
await load();
const persisted = await run("cardTitles()");
check(
    persisted[0][0] === "Entertainment" && persisted[1][1].includes("Wiki") && persisted[1][1].includes("FB"),
    "changes persist across reload",
    persisted,
);

await run("byTitle('Edit').click()");
await run(`promptAnswer = '{"categories": [{"id": 1}]}'; byTitle('Import').click()`);
check(
    (await run("alerts.at(-1)")) === "Import failed: not valid StartPage data" &&
        (await run("cardTitles()")).length === 2,
    "invalid import rejected",
    await run("alerts"),
);
await run("promptAnswer = 'not json'; byTitle('Import').click()");
check((await run("alerts.at(-1)")) === "Import failed: not valid StartPage data", "malformed import rejected");
await run(
    `promptAnswer = JSON.stringify({ categories: [{ id: 'c', label: 'Imported', bookmarks: [{ id: 'b', title: 'Site', subtitle: 's', url: 'https://example.com', host: 'example.com', iconType: 'google' }] }] }); byTitle('Import').click()`,
);
check(
    JSON.stringify(await run("cardTitles()")) === JSON.stringify([["Imported", ["Site"]]]),
    "valid import applied",
    await run("cardTitles()"),
);

await run("localStorage.setItem('startpage-categories', '{broken')");
await load();
check((await run("cardTitles()")).length === 2, "corrupt local data falls back to defaults");

await run("byTitle('Edit').click()");
await run(`(async () => {
    window.store = await import('/src/store/data.store.svelte.ts');
    store.authToken.value = 'expired';
    window.fetch = async () => new Response('unauthorized', { status: 401 });
})()`);
await run("byTitle('Save').click()");
await Bun.sleep(300);
await run("byTitle('Edit').click()");
const expired = await run(
    "[alerts.at(-1), store.authToken.value === undefined, store.isSyncing.value, !!byTitle('Google Login')]",
);
check(
    expired[0] === "Cloud sync failed: Google session expired, log in again" &&
        expired[1] &&
        expired[2] === false &&
        expired[3],
    "expired token: alert, spinner reset, login shown",
    expired,
);

await run(
    `store.authToken.value = 'ok'; window.fetch = async (url) => String(url).includes('alt=media') ? new Response('') : new Response(JSON.stringify({ files: [{ id: 'f' }] }))`,
);
const before = JSON.stringify(await run("cardTitles()"));
await run("byTitle('Fetch cloud data').click()");
await Bun.sleep(300);
check(
    (await run("alerts.at(-1)")) === "Cloud sync failed: no valid data in Google Drive, kept local data" &&
        JSON.stringify(await run("cardTitles()")) === before &&
        (await run("store.isSyncing.value")) === false,
    "empty cloud file keeps local data",
    await run("alerts"),
);

check(!(await run("!!$('#quote')")), "no quote without a readwise token");

const highlightsPage = JSON.stringify({
    next: null,
    results: [
        { text: "> Tagged one\n>\n> Author A", tags: [{ name: "Quotes-Cycle" }] },
        { text: "Tagged two", tags: [{ name: "quotes-cycle" }] },
        { text: "Untagged", tags: [{ name: "other" }] },
    ],
});
await run(`window.readwiseRequests = []; window.fetch = async (url, init) => {
    readwiseRequests.push([String(url), init?.headers?.Authorization]);
    return new Response(${JSON.stringify(highlightsPage)});
}`);
await run("promptAnswer = ' secret-token '; byTitle('Readwise token').click()");
await Bun.sleep(300);
const quoteParagraphs = await run("[...document.querySelectorAll('#quote p')].map(p => p.textContent)");
const firstRequest = await run("readwiseRequests[0]");
check(
    ["Tagged one|Author A", "Tagged two"].includes(quoteParagraphs.join("|")) &&
        firstRequest[0].includes("readwise.io/api/v2/highlights/") &&
        firstRequest[1] === "Token secret-token",
    "readwise token shows a tagged quote without blockquote markers",
    [quoteParagraphs, firstRequest],
);

await load();
check(
    (await run("[...document.querySelectorAll('#quote p')].map(p => p.textContent)")).join("|") ===
        quoteParagraphs.join("|"),
    "quote comes from cache after reload",
);

const quoteText = "[...document.querySelectorAll('#quote p')].map(p => p.textContent).join('|')";
await run(`window.readwiseRequests = []; window.fetch = async (url) => {
    readwiseRequests.push(String(url));
    return new Response(${JSON.stringify(highlightsPage)});
}`);
await run("byTitle('Edit').click()");
await run("byTitle('Next quote').click()");
await Bun.sleep(300);
const nextQuote = await run(quoteText);
check(
    nextQuote !== quoteParagraphs.join("|") && (await run("readwiseRequests.length")) === 1,
    "next quote refetches and shows a different quote",
    nextQuote,
);
await load();
check((await run(quoteText)) === nextQuote, "next quote persists across reload");

const nearTwoPm = await page.evaluateOnNewDocument(`
    const RealDate = Date;
    const shift = new RealDate().setHours(13, 59, 58, 500) - RealDate.now();
    window.Date = class extends RealDate {
        constructor(...args) {
            super(...(args.length ? args : [RealDate.now() + shift]));
        }
        static now() {
            return RealDate.now() + shift;
        }
    };
    window.readwiseRequests = [];
    window.fetch = async (url) => {
        readwiseRequests.push(String(url));
        return new Response(${JSON.stringify(highlightsPage)});
    };
`);
await load();
await run(`(async () => {
    const { currentSlot } = await import('/src/api/readwise.svelte.ts');
    const quotes = ${JSON.stringify(["Tagged one\n\nAuthor A", "Tagged two"])};
    localStorage.setItem('startpage-readwise-quotes', JSON.stringify({ slot: currentSlot(), quotes, skip: 0 }));
})()`);
await load();
const beforeSwitch = await run(quoteText);
await Bun.sleep(2500);
const afterSwitch = [await run(quoteText), await run("readwiseRequests.length")];
await page.removeScriptToEvaluateOnNewDocument(nearTwoPm.identifier);
check(
    afterSwitch[0] !== beforeSwitch && afterSwitch[1] === 1,
    "open tab switches quote and refetches at 14:00 without reload",
    [beforeSwitch, ...afterSwitch],
);

await run(
    "localStorage.setItem('startpage-readwise-quotes', JSON.stringify({ slot: 0, quotes: ['Cached while Readwise hangs'] }))",
);
const hangingReadwise = await page.evaluateOnNewDocument(`
    window.fetch = (url) => {
        window.readwiseFetchStartedAt = performance.now();
        return new Promise(() => {});
    };
`);
await load();
await page.waitForFunction(
    "window.readwiseFetchStartedAt !== undefined && performance.getEntriesByName('first-contentful-paint').length",
);
const slowReadwise = await run(`(() => {
    const paint = performance.getEntriesByName('first-contentful-paint')[0];
    return {
        paintAt: paint?.startTime,
        fetchAt: window.readwiseFetchStartedAt,
        quote: $('#quote')?.textContent.trim(),
        categories: cardTitles().length,
    };
})()`);
await page.removeScriptToEvaluateOnNewDocument(hangingReadwise.identifier);
check(
    slowReadwise.categories === 2 &&
        slowReadwise.quote === "Cached while Readwise hangs" &&
        slowReadwise.fetchAt > slowReadwise.paintAt,
    "hanging readwise refresh starts after first paint and blocks nothing",
    slowReadwise,
);

const slots = await run(`(async () => {
    const { currentSlot } = await import('/src/api/readwise.svelte.ts');
    const at = (day, hour, minute) => currentSlot(new Date(2026, 9, day, hour, minute));
    return [at(27, 1, 59), at(27, 2, 0), at(27, 13, 59), at(27, 14, 0), at(28, 1, 59)];
})()`);
check(
    slots[0] + 1 === slots[1] && slots[1] === slots[2] && slots[2] + 1 === slots[3] && slots[3] === slots[4],
    "quote slot switches at 02:00 and 14:00",
    slots,
);

await run("byTitle('Edit').click()");
await run(
    "window.fetch = async () => new Response('unauthorized', { status: 401 }); promptAnswer = 'bad'; byTitle('Readwise token').click()",
);
await Bun.sleep(300);
check((await run("alerts.at(-1)")) === "Readwise sync failed: Readwise responded 401", "bad readwise token alerts");

await run("promptAnswer = ''; byTitle('Readwise token').click()");
check(
    !(await run("!!$('#quote')")) && (await run("localStorage.getItem('startpage-readwise-token')")) === null,
    "empty token removes the quote",
);

const unexpected = consoleProblems.filter((m) => !String(m).includes("Not running as an extension"));
check(unexpected.length === 0, "no console warnings or errors", unexpected);

await browser.close();
await devServer.close();
console.log(failures === 0 ? "ALL PASSED" : `${failures} FAILED`);
process.exit(failures ? 1 : 0);
