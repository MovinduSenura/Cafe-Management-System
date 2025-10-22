const Report = require('../models/Report');
const logger = require('../utils/logger');

class ReportService {
  async generateKpis() {
    logger.info('Generating KPIs report');
    // In a real system, we'd query order/payment DBs. Here, return placeholders.
    const kpis = {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      topCategory: 'N/A',
      generatedAt: new Date().toISOString()
    };
    logger.info('KPIs generated successfully', { kpis });
    return kpis;
  }

  async saveReport({ name, type, data, params }) {
    logger.info('Saving report', { name, type });
    const report = new Report({ name, type, data, params });
    await report.save();
    logger.info('Report saved successfully', { reportId: report._id });
    return report;
  }

  async listReports({ type, limit = 50 }) {
    logger.info('Listing reports', { type, limit });
    const q = {};
    if (type) q.type = type;
    const reports = await Report.find(q).sort({ createdAt: -1 }).limit(limit);
    logger.info('Reports retrieved successfully', { count: reports.length });
    return reports;
  }

  async getReport(id) {
    logger.info('Getting report', { reportId: id });
    const r = await Report.findById(id);
    if (!r) {
      logger.error('Report not found', { reportId: id });
      throw new Error('Report not found');
    }
    logger.info('Report retrieved successfully', { reportId: id });
    return r;
  }
}

module.exports = new ReportService();
