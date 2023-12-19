import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Row } from 'jspdf-autotable';

const generatePdf = (pdfInfo, filters, tableHeads, data) => {
    const doc = new jsPDF();
    const tableRows = [];

    data.forEach(row => {
        let rowData = Object.values(row);
        rowData = rowData.slice(1);
        tableRows.push(rowData);
    });
    let y = 15;
    let x = 15;
    doc.text("UrbanMarket - " + pdfInfo.title, x, y);
    y += 12;
    doc.setFontSize(12);
    filters.map(filter => {
        doc.text(filter.name + ": " + filter.value, x, y);
        if (x > 145) {
            x = 15;
            y += 10;
        } else {
            x += 65;
        }
    });
    y += 10;
    doc.autoTable(tableHeads, tableRows, { startY: y });
    doc.save(pdfInfo.fileName + ".pdf");
};

export default generatePdf;