import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Register fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const runtime = "nodejs";
export const maxDuration = 30; // Set max duration to 30 seconds to match Vercel's limit

export async function POST(request) {
  try {
    const { html } = await request.json();

    console.log("Starting PDF generation with pdfmake...");

    // Convert HTML to a simple text representation
    // This is a basic conversion - for complex HTML you'd need a proper HTML parser
    const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    // Define the document definition
    const docDefinition = {
      content: [
        { text: 'Generated PDF', style: 'header' },
        { text: textContent, style: 'content' }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        content: {
          fontSize: 12,
          lineHeight: 1.5
        }
      },
      defaultStyle: {
        font: 'Roboto'
      }
    };

    // Create the PDF
    const pdfDoc = pdfMake.createPdf(docDefinition);
    
    // Get the PDF as a buffer
    return new Promise((resolve) => {
      pdfDoc.getBuffer((buffer) => {
        resolve(new Response(buffer, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=document.pdf",
          },
        }));
      });
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