import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-hot-toast";

export const generateInvoicePDF = async (
  invoice,
  printableRef,
  setIsGenerating
) => {
  setIsGenerating(true);
  toast.loading("Generating PDF...", { id: "pdf-generation" });

  try {
    const element = printableRef.current;
    if (!element) {
      throw new Error("Printable element not found");
    }

    // Store original styles
    const originalStyles = {
      position: element.style.position,
      visibility: element.style.visibility,
      zIndex: element.style.zIndex,
      top: element.style.top,
      left: element.style.left,
    };

    // Make element visible for capture
    element.style.position = "absolute";
    element.style.visibility = "visible";
    element.style.zIndex = "9999";
    element.style.top = "0";
    element.style.left = "0";

    // Wait for rendering
    await new Promise((resolve) => setTimeout(resolve, 500));

    const canvas = await html2canvas(element, {
      scale: 2,
      logging: true,
      useCORS: true,
      backgroundColor: "#ffffff",
      allowTaint: true,
      onclone: (clonedDoc, element) => {
        // Ensure all child elements are visible
        element.querySelectorAll("*").forEach((el) => {
          el.style.visibility = "visible";
          el.style.opacity = "1";
        });
      },
    });

    // Restore original styles
    Object.assign(element.style, originalStyles);

    const pdf = new jsPDF("p", "mm", "a4");
    const imgData = canvas.toDataURL("image/png", 1.0);

    // Calculate dimensions with 10mm margins
    const pageWidth = pdf.internal.pageSize.getWidth() - 20;
    const pageHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, pageWidth, pageHeight);
    pdf.save(`invoice_${invoice.invoiceNumber || Date.now()}.pdf`);

    toast.success("PDF generated successfully", { id: "pdf-generation" });
  } catch (error) {
    console.error("PDF generation failed:", error);
    toast.error("Failed to generate PDF", { id: "pdf-generation" });
    throw error;
  } finally {
    setIsGenerating(false);
  }
};
