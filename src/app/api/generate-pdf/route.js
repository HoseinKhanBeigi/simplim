import puppeteer from "puppeteer-core";
import chromium from "chrome-aws-lambda";

export const runtime = "nodejs";

export async function POST(req) {
  const { html } = await req.json();

  const execPath = await chromium.executablePath;

  if (!execPath) {
    throw new Error("❌ No Chromium executable found in Vercel. Check chrome-aws-lambda setup.");
  }
  
  const browser = await puppeteer.launch({
    executablePath: execPath,
    args: chromium.args,
    headless: chromium.headless,
    defaultViewport: chromium.defaultViewport,
  });
  
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdf = await page.pdf({ format: "A4" });

  await browser.close();

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=document.pdf",
    },
  });
}
