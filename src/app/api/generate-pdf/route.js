import puppeteer from "puppeteer-core";
import chromium from "chrome-aws-lambda";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { html } = await request.json();

    const browser = await puppeteer.launch({
      executablePath: await chromium.executablePath || "/usr/bin/chromium-browser",
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      headless: chromium.headless,
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
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate PDF",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
