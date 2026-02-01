import PDFDocument from 'pdfkit';

export const generateReportPDF = (data) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks = [];
    
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    
    // Header
    doc.fontSize(20).text('SafeLanka Crime Report', { align: 'center' });
    doc.moveDown();
    
    // Date
    doc.fontSize(12).text(`Generated: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}`, { align: 'center' });
    doc.moveDown(2);
    
    // Summary
    doc.fontSize(14).text('Summary Statistics', { underline: true });
    doc.moveDown();
    doc.fontSize(11);
    
    if (data.summary) {
      doc.text(`Total Records: ${data.summary.totalRecords || 0}`);
      doc.text(`Total Count: ${data.summary.totalCount || 0}`);
      doc.moveDown();
    }
    
    // By Division
    if (data.byDivision && data.byDivision.length > 0) {
      doc.fontSize(14).text('By Division', { underline: true });
      doc.moveDown();
      doc.fontSize(11);
      data.byDivision.forEach(item => {
        doc.text(`${item.division}: ${item.count} incidents`);
      });
      doc.moveDown();
    }
    
    // By Crime Type
    if (data.byCrimeType && data.byCrimeType.length > 0) {
      doc.fontSize(14).text('By Crime Type', { underline: true });
      doc.moveDown();
      doc.fontSize(11);
      data.byCrimeType.forEach(item => {
        doc.text(`${item.crime_type}: ${item.count} incidents`);
      });
    }
    
    doc.end();
  });
};