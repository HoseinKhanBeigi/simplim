import puppeteer from "puppeteer";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { html } = await request.json();

    console.log("html", html);

    // Launch Puppeteer with specific Mac ARM configuration
    const browser = await puppeteer.launch({
      headless: "new",
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // ✅ required!

      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--font-render-hinting=none", // Better font rendering
        "--disable-gpu",
        "--disable-web-security", // Allow loading local resources
      ],
      defaultViewport: {
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123, // A4 height in pixels at 96 DPI
        deviceScaleFactor: 2, // Higher resolution
      },
    });

    const page = await browser.newPage();

    // Add default styles for better rendering of Lexical features
    const htmlWithStyles = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;            
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    // Set the content and wait for it to load
    await page.setContent(htmlWithStyles, {
      waitUntil: ["load", "networkidle0", "domcontentloaded"],
      timeout: 30000,
    });

    // Wait for fonts to load
    await page.evaluateHandle("document.fonts.ready");

    // Clean up text content
    await page.evaluate(() => {
      // Remove multiple spaces
      // const paragraphs = document.querySelectorAll('p');
      // paragraphs.forEach(p => {
      //   p.textContent = p.textContent.replace(/\s+/g, ' ').trim();
      // });
      // Remove the line break conversion since Lexical already handles them correctly
      // const content = document.body.innerHTML;
      // document.body.innerHTML = content.replace(/\n/g, '<br>');
    });

    // Add script to convert grid layouts to flex
    await page.evaluate(() => {
      const gridElements = document.querySelectorAll('[style*="grid-template-columns"]');
      gridElements.forEach((element) => {
        const gridTemplate = element.style.gridTemplateColumns;
        
        // Handle specific 1fr 3fr ratio
        if (gridTemplate === '1fr 3fr') {
          element.style.display = 'flex';
          element.style.flexWrap = 'wrap';
          element.style.gap = '20px';
    
          // Convert grid children with exact ratio
          Array.from(element.children).forEach((child, index) => {
            if (index === 0) {
              // First column (1fr)
              child.style.flex = '1 1 calc(25% - 10px)';
              child.style.minWidth = 'calc(25% - 10px)';
            } else {
              // Second column (3fr)
              child.style.flex = '3 3 calc(75% - 10px)';
              child.style.minWidth = 'calc(75% - 10px)';
            }
          });
        } else {
          // Handle other grid layouts as before
          const columns = gridTemplate.split(' ').length;
          element.style.display = 'flex';
          element.style.flexWrap = 'wrap';
          element.style.gap = '20px';
    
          Array.from(element.children).forEach((child) => {
            child.style.flex = `1 1 calc(${100 / columns}% - ${((columns - 1) * 20) / columns}px)`;
            child.style.minWidth = `calc(${100 / columns}% - ${((columns - 1) * 20) / columns}px)`;
          });
        }
      });
    });

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

    await browser.close();

    // Return the PDF
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
  }
}
