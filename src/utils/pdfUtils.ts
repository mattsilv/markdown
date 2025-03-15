import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// Initialize pdfmake with fonts
pdfMake.vfs = pdfFonts.pdfMake?.vfs || pdfFonts.vfs;

export function generatePDF(title: string, content: string, date: string) {
  // Convert HTML content to plain text for now (basic implementation)
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;
  const plainText = tempDiv.textContent || "";

  const docDefinition = {
    content: [
      { text: title, style: "header" },
      { text: `Generated on ${date}`, style: "subheader" },
      { text: plainText, style: "content" },
    ],
    styles: {
      header: {
        fontSize: 24,
        bold: true,
        marginBottom: 10,
      },
      subheader: {
        fontSize: 14,
        marginBottom: 20,
        color: "#666666",
      },
      content: {
        fontSize: 12,
        lineHeight: 1.5,
      },
    },
  };

  // Download the PDF
  pdfMake
    .createPdf(docDefinition)
    .download(`${title.toLowerCase().replace(/\s+/g, "-")}.pdf`);
}
