// import puppeteer from "puppeteer";
// import puppeteer from "puppeteer-core";
// import chromium from "chrome-aws-lambda";
import html2pdf from 'html2pdf.js';

export const runtime = "nodejs";
export const maxDuration = 30; // Set max duration to 30 seconds to match Vercel's limit

export async function POST(request) {
  try {
    const { html } = await request.json();

    console.log("Starting PDF generation with html2pdf.js...");

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

    // Configure PDF options
    const options = {
      margin: 0,
      filename: 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      },
      pagebreak: { mode: 'avoid-all' }
    };

    // Generate PDF
    const pdf = await html2pdf().from(htmlWithStyles).set(options).outputPdf('arraybuffer');

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
