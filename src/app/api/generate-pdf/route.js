import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request) {
  try {
    const { content } = await request.json();

    // Launch browser with proper configuration
    const browser = await puppeteer.launch({
      args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    // Set the HTML content with proper styling
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              padding: 20px;
            }
            /* ContentEditable root styles */
            .ContentEditable__root {
              min-height: 150px;
              border: 1px solid #ddd;
              border-radius: 4px;
              padding: 15px;
              margin: 0;
              outline: none;
              position: relative;
              tab-size: 1;
              text-align: left;
              white-space: pre-wrap;
              word-wrap: break-word;
              background-color: #fff;
            }
            .ContentEditable__root:focus {
              border-color: #007bff;
              box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
            }
            /* Code block styles matching PlaygroundEditorTheme */
            .PlaygroundEditorTheme__code {
              background-color: rgb(240, 242, 245);
              font-family: Menlo, Consolas, Monaco, monospace;
              display: block;
              padding: 8px 8px 8px 52px;
              line-height: 1.53;
              font-size: 13px;
              margin: 0;
              margin-top: 8px;
              margin-bottom: 8px;
              overflow-x: auto;
              position: relative;
              tab-size: 2;
            }
            .PlaygroundEditorTheme__code:before {
              content: attr(data-gutter);
              position: absolute;
              background-color: #eee;
              left: 0;
              top: 0;
              border-right: 1px solid #ccc;
              padding: 8px;
              color: #777;
              white-space: pre-wrap;
              text-align: right;
              min-width: 25px;
            }
            /* Sticky note styles */
            .sticky-note {
              background-color: #fff8dc;
              border: 1px solid #e6d8b5;
              border-radius: 4px;
              padding: 12px;
              margin: 8px 0;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              position: relative;
              min-height: 100px;
            }
            .sticky-note::before {
              content: '';
              position: absolute;
              top: 0;
              right: 0;
              width: 0;
              height: 0;
              border-style: solid;
              border-width: 0 20px 20px 0;
              border-color: transparent #f5e6b3 transparent transparent;
            }
            .sticky-note-content {
              font-family: 'Comic Sans MS', cursive, sans-serif;
              font-size: 14px;
              line-height: 1.4;
              color: #333;
            }
            /* Syntax highlighting colors */
            .PlaygroundEditorTheme__tokenComment {
              color: slategray;
            }
            .PlaygroundEditorTheme__tokenPunctuation {
              color: #999;
            }
            .PlaygroundEditorTheme__tokenProperty {
              color: #905;
            }
            .PlaygroundEditorTheme__tokenSelector {
              color: #690;
            }
            .PlaygroundEditorTheme__tokenOperator {
              color: #9a6e3a;
            }
            .PlaygroundEditorTheme__tokenAttr {
              color: #07a;
            }
            .PlaygroundEditorTheme__tokenVariable {
              color: #e90;
            }
            .PlaygroundEditorTheme__tokenFunction {
              color: #dd4a68;
            }
          </style>
        </head>
        <body>
          <div class="ContentEditable__root">
            ${content}
          </div>
        </body>
      </html>
    `;

    // Wait for styles to be applied
    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    // Generate PDF with proper margins and format
    const pdf = await page.pdf({
      format: 'A4',
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm',
      },
      printBackground: true,
    });

    await browser.close();

    // Return the PDF as a response
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="document.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
} 