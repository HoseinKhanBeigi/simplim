// import puppeteer from "puppeteer";
import puppeteer from "puppeteer-core";
import chromium from "chrome-aws-lambda";

export const runtime = "nodejs";
export const maxDuration = 60; // Set max duration to 60 seconds

export async function POST(request) {
  let browser = null;
  try {
    const { html } = await request.json();

    console.log("Starting PDF generation...");

    // Determine if we're running in Vercel or local environment
    const isVercel = process.env.VERCEL === '1';
    
    // Configure browser launch options based on environment
    const launchOptions = isVercel
      ? {
          executablePath: await chromium.executablePath,
          args: [...chromium.args, '--no-sandbox'],
          defaultViewport: chromium.defaultViewport,
          headless: chromium.headless,
          ignoreHTTPSErrors: true,
        }
      : {
          executablePath: process.platform === "darwin"
            ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
            : process.platform === "win32"
            ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
            : "/usr/bin/chromium-browser",
          headless: "new",
          args: ['--no-sandbox'],
          ignoreHTTPSErrors: true,
        };

    // Launch browser with combined options
    browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();
    
    // Set longer timeout for page operations
    await page.setDefaultNavigationTimeout(30000); // 30 seconds
    await page.setDefaultTimeout(30000);

    // Add default styles for better rendering
    const htmlWithStyles = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            @page {
              size: A4;
              margin: 0;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    // Set content and wait for network to be idle
    await page.setContent(htmlWithStyles, {
      waitUntil: ["networkidle0", "domcontentloaded"],
      timeout: 30000,
    });

    // Wait for fonts and resources to load
    await Promise.all([
      page.evaluateHandle("document.fonts.ready"),
      page.waitForFunction(() => document.readyState === 'complete', { timeout: 5000 })
    ]);

    // Generate PDF with better settings
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },
      displayHeaderFooter: true,
      headerTemplate: "<div></div>",
      footerTemplate:
        '<div style="text-align: center; width: 100%;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',
      preferCSSPageSize: true,
    });

    await page.close();
    await browser.close();

    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=document.pdf",
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate PDF",
        details: error.message,
        stack: error.stack,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error("Failed to close browser:", closeError);
      }
    }
  }
}
