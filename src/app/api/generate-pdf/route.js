import puppeteer from 'puppeteer';
import { NextResponse } from 'next/server';

export async function POST(req) {
  let browser = null;
  try {
    const { htmlContent } = await req.json();

    // Create a full HTML document with necessary styles
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
          <style>
            body {
              padding: 40px;
              font-family: Arial, sans-serif;
              margin: 0;
            }
            .ql-editor {
              padding: 0;
              line-height: 1.5;
              min-height: auto !important;
            }
          </style>
        </head>
        <body>
          <div class="ql-editor">${htmlContent}</div>
        </body>
      </html>
    `;

    // Launch Puppeteer with system Chrome
    browser = await puppeteer.launch({
      headless: 'new',
      channel: 'chrome',
      executablePath: process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : undefined,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080'
      ]
    });

    const page = await browser.newPage();
    
    // Set viewport for consistent rendering
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 2
    });
    
    // Set content with timeout and wait for network idle
    await page.setContent(fullHtml, { 
      waitUntil: ['networkidle0', 'load', 'domcontentloaded'],
      timeout: 30000
    });
    
    // Wait for fonts and images to load
    await page.evaluateHandle('document.fonts.ready');
    
    // Generate PDF with A4 format
    const pdf = await page.pdf({
      format: 'A4',
      margin: {
        top: '40px',
        right: '40px',
        bottom: '40px',
        left: '40px'
      },
      printBackground: true,
      preferCSSPageSize: true,
      scale: 0.8 // Slightly scale down to ensure content fits
    });

    // Close browser
    await browser.close();
    browser = null;

    // Return the PDF as a response
    return new NextResponse(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=document.pdf'
      }
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Make sure to close the browser in case of error
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }
    return NextResponse.json(
      { error: 'Failed to generate PDF: ' + error.message },
      { status: 500 }
    );
  }
} 