import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoicePDF = (formData, selectedClient, itemsList, totals) => {
    const doc = new jsPDF();
    
    // Company Branding & Header
    doc.setFont("helvetica", "bold"); 
    doc.setFontSize(22); 
    doc.setTextColor(33, 37, 41);
    doc.text("SPIL LABS", 14, 22);
    
    doc.setFont("helvetica", "normal"); 
    doc.setFontSize(10); 
    doc.setTextColor(100, 100, 100);
    doc.text("No 04, Pagoda Road,\nNugegoda, Sri Lanka\ninfo@spil.com", 14, 28);
    
    // Invoice Title
    doc.setFont("helvetica", "bold"); 
    doc.setFontSize(28); 
    doc.setTextColor(0, 102, 204);
    doc.text("INVOICE", 195, 30, { align: "right" });
    doc.setDrawColor(220, 220, 220); 
    doc.setLineWidth(0.5); 
    doc.line(14, 40, 195, 40);
    
    // Billing & Invoice Details
    doc.setFontSize(11); 
    doc.setTextColor(33, 37, 41); 
    doc.text("BILL TO:", 14, 50);
    
    const addressLines = [
        selectedClient?.customerName || 'Unknown Customer',
        formData.address1, formData.address2, formData.suburb,
        formData.state ? `${formData.state} ${formData.postCode}` : formData.postCode
    ].filter(Boolean);

    let currentY = 56;
    doc.setFont("helvetica", "normal"); 
    doc.setTextColor(80, 80, 80);
    addressLines.forEach(line => { doc.text(line, 14, currentY); currentY += 5; });

    doc.setFont("helvetica", "bold"); 
    doc.setTextColor(33, 37, 41); 
    doc.setFontSize(10);
    doc.text("Invoice No:", 130, 50); 
    doc.text("Date:", 130, 56); 
    doc.text("Reference No:", 130, 62);
    
    doc.setFont("helvetica", "normal"); 
    doc.setTextColor(80, 80, 80);
    doc.text(formData.invoiceNo || 'DRAFT', 195, 50, { align: "right" });
    doc.text(formData.invoiceDate, 195, 56, { align: "right" });
    doc.text(formData.referenceNo || '-', 195, 62, { align: "right" });

    // Table Data
    const tableColumn = ["Item Code", "Description", "Qty", "Price", "Tax %", "Total"];
    const tableRows = formData.orderItems.map(item => {
        const excl = (parseInt(item.quantity) || 0) * (parseFloat(item.price) || 0);
        const tax = excl * (parseFloat(item.taxRate || 0) / 100);
        const foundItem = itemsList.find(i => i.id === parseInt(item.itemId));
        return [
            foundItem ? foundItem.itemCode : '-', 
            item.description || '-',
            parseInt(item.quantity) || 0, 
            parseFloat(item.price || 0).toFixed(2),
            parseFloat(item.taxRate || 0).toFixed(2), 
            (excl + tax).toFixed(2)
        ];
    });

    autoTable(doc, {
        startY: Math.max(currentY + 5, 75), head: [tableColumn], body: tableRows, theme: 'striped',
        headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
        bodyStyles: { textColor: [50, 50, 50], halign: 'center' }, columnStyles: { 1: { halign: 'left' } },
        alternateRowStyles: { fillColor: [245, 247, 250] }, margin: { left: 14, right: 14 }
    });

    // Totals & Footer
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 75;
    if (formData.note) {
        doc.setFont("helvetica", "bold"); doc.setTextColor(33, 37, 41); doc.text("Order Notes:", 14, finalY + 12);
        doc.setFont("helvetica", "normal"); doc.setTextColor(80, 80, 80);
        doc.text(doc.splitTextToSize(formData.note, 100), 14, finalY + 18);
    }

    doc.text("Total Excl:", 140, finalY + 12); doc.text(totals.totalExcl.toFixed(2), 195, finalY + 12, { align: "right" });
    doc.text("Total Tax:", 140, finalY + 18); doc.text(totals.totalTax.toFixed(2), 195, finalY + 18, { align: "right" });
    doc.setDrawColor(200, 200, 200); doc.line(140, finalY + 22, 195, finalY + 22);
    doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(33, 37, 41);
    doc.text("Total Incl:", 140, finalY + 28); doc.text(totals.totalIncl.toFixed(2), 195, finalY + 28, { align: "right" });

    doc.save(`Invoice_${formData.invoiceNo || 'Draft'}.pdf`);
};