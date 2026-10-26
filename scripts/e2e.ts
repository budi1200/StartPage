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

const unexpected = consoleProblems.filter((m) => !String(m).includes("Not running as an extension"));
check(unexpected.length === 0, "no console warnings or errors", unexpected);

await browser.close();
await devServer.close();
console.log(failures === 0 ? "ALL PASSED" : `${failures} FAILED`);
process.exit(failures ? 1 : 0);
