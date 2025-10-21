const Report = require('../models/Report');
const logger = require('../utils/logger');

class ReportService {
  async generateKpis() {
    // In a real system, we'd query order/payment DBs. Here, return placeholders.
    const kpis = {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      topCategory: 'N/A',
      generatedAt: new Date().toISOString()
    };
    return kpis;
  }

  async saveReport({ name, type, data, params }) {
    const report = new Report({ name, type, data, params });
    await report.save();
    return report;
  }

  async listReports({ type, limit = 50 }) {
    const q = {};
    if (type) q.type = type;
    return Report.find(q).sort({ createdAt: -1 }).limit(limit);
  }

  async getReport(id) {
    const r = await Report.findById(id);
    if (!r) throw new Error('Report not found');
    return r;
  }
}

module.exports = new ReportService();
