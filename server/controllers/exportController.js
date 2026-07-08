const PDFDocument = require('pdfkit');
const Audit = require('../models/Audit');

// @desc    Export audit as PDF
// @route   GET /api/export/pdf/:id
// @access  Private
const exportPDF = async (req, res) => {
  try {
    const audit = await Audit.findById(req.params.id);
    if (!audit) {
      return res.status(404).json({ message: 'Audit not found' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=seo-report-${audit._id}.pdf`
    );

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    // Header
    doc
      .fillColor('#1e40af')
      .fontSize(24)
      .text('SEO Audit Report', { align: 'center' })
      .moveDown();

    doc
      .fillColor('#000')
      .fontSize(14)
      .text(`Website: ${audit.url}`)
      .text(`Date: ${new Date(audit.createdAt).toLocaleString()}`)
      .moveDown(2);

    // Overall Score
    doc
      .fillColor('#1e40af')
      .fontSize(18)
      .text('Overall SEO Score', { underline: true })
      .moveDown();
    doc
      .fillColor(audit.score >= 80 ? '#10b981' : audit.score >= 50 ? '#f59e0b' : '#ef4444')
      .fontSize(36)
      .text(`${audit.score}/100`, { align: 'center' })
      .moveDown(2);
    doc.fillColor('#000');

    // Category Scores
    doc.fontSize(18).text('Category Scores', { underline: true }).moveDown();
    const categories = [
      { name: 'SEO', score: audit.seo },
      { name: 'Performance', score: audit.performance },
      { name: 'Accessibility', score: audit.accessibility },
      { name: 'Best Practices', score: audit.bestPractices }
    ];
    categories.forEach(cat => {
      doc.fontSize(14).text(`${cat.name}: ${cat.score}/100`).moveDown(0.5);
    });
    doc.moveDown();

    // Core Web Vitals
    if (audit.coreWebVitals) {
      doc.fontSize(18).text('Core Web Vitals', { underline: true }).moveDown();
      const vitals = [
        { name: 'LCP', value: audit.coreWebVitals.lcp, status: audit.coreWebVitals.lcpStatus },
        { name: 'CLS', value: audit.coreWebVitals.cls, status: audit.coreWebVitals.clsStatus },
        { name: 'INP', value: audit.coreWebVitals.inp, status: audit.coreWebVitals.inpStatus },
        { name: 'FCP', value: audit.coreWebVitals.fcp },
        { name: 'TTFB', value: audit.coreWebVitals.ttfb }
      ];
      vitals.forEach(vital => {
        let text = `${vital.name}: ${vital.value}`;
        if (vital.status) text += ` (${vital.status})`;
        doc.fontSize(14).text(text).moveDown(0.5);
      });
      doc.moveDown();
    }

    // Issues
    if (audit.issues && audit.issues.length > 0) {
      doc.fontSize(18).text('Issues Found', { underline: true }).moveDown();
      audit.issues.forEach((issue, idx) => {
        doc.fontSize(14).text(`${idx + 1}. ${issue.message}`).moveDown(0.5);
      });
      doc.moveDown();
    }

    // Recommendations
    if (audit.recommendations && audit.recommendations.length > 0) {
      doc.fontSize(18).text('Recommendations', { underline: true }).moveDown();
      audit.recommendations.forEach((rec, idx) => {
        if (idx < 10) {
          doc.fontSize(12).text(`${idx + 1}. ${rec}`).moveDown(0.5);
        }
      });
    }

    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { exportPDF };
