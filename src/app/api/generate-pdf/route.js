import puppeteer from "puppeteer-core";
import chromium from "chrome-aws-lambda";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { html } = await req.json();

    const browser = await puppeteer.launch({
      executablePath: await chromium.executablePath, // ✅ Vercel-compatible binary
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      headless: chromium.headless, // ❗ Must be chromium.headless
    });

    const page = await browser.newPage();

    const htmlDoc = `
      <html>
        <head><meta charset="utf-8"></head>
        <body>${html}</body>
      </html>
    `;

    await page.setContent(htmlDoc, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({ format: "A4" });

    await browser.close();

    return new Response(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=document.pdf",
      },
    });
  } catch (err) {
    console.error("PDF Error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate PDF", details: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
