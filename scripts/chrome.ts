import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { launch } from "puppeteer-core";
import { build } from "vite";

await build();

const browser = await launch({
    channel: "chrome",
    headless: false,
    defaultViewport: null,
    enableExtensions: [resolve("dist")],
    userDataDir: join(tmpdir(), "startpage-chrome-profile"),
});

const [blankPage] = await browser.pages();
const page = await browser.newPage();
await page.goto("chrome://newtab/");
await blankPage?.close();

await new Promise((resolve) => browser.once("disconnected", resolve));
