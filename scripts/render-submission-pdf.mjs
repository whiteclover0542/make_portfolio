// 과제8/제출-report.html을 A4 PDF로 렌더링한다.
import { chromium } from "playwright";
import path from "node:path";
import { pathToFileURL } from "node:url";

const src = path.join(process.cwd(), "과제8", "제출-report.html");
const out = path.join(process.cwd(), "과제8", "제출.pdf");

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(src).href, { waitUntil: "networkidle" });
await page.pdf({
  path: out,
  format: "A4",
  printBackground: true,
  margin: { top: "0", bottom: "16px", left: "0", right: "0" },
});
await browser.close();
console.log("saved", out);
