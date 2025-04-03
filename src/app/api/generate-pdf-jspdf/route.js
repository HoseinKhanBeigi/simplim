import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const runtime = "nodejs";
export const maxDuration = 30; // Set max duration to 30 seconds to match Vercel's limit

export async function POST(request) {
  try {
    const { html } = await request.json();

    console.log("Starting PDF generation with jsPDF...");

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
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    // Create a temporary DOM element to render the HTML
    const element = document.createElement('div');
    element.innerHTML = htmlWithStyles;
    document.body.appendChild(element);

    // Convert HTML to canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true
    });

    // Remove the temporary element
    document.body.removeChild(element);

    // Create PDF from canvas
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Calculate dimensions to fit the page
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add the image to the PDF
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

    // Get the PDF as an array buffer
    const pdfBuffer = pdf.output('arraybuffer');

    return new Response(pdfBuffer, {
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