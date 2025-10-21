const service = require('../services/reportService');

function toCsv(objArray) {
  const arr = Array.isArray(objArray) ? objArray : [objArray];
  if (arr.length === 0) return '';
  const headers = Object.keys(arr[0]);
  const lines = [headers.join(',')];
  for (const row of arr) {
    lines.push(headers.map(h => JSON.stringify(row[h] ?? '')).join(','));
  }
  return lines.join('\n');
}

class ReportController {
  async kpis(req, res) {
    try {
      const data = await service.generateKpis();
      res.json({ success: true, data });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Failed to generate KPIs' });
    }
  }

  async kpisCsv(req, res) {
    try {
      const data = await service.generateKpis();
      const csv = toCsv(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="kpis.csv"');
      res.send(csv);
    } catch (e) {
      res.status(500).json({ success: false, message: 'Failed to generate KPIs CSV' });
    }
  }

  async save(req, res) {
    try {
      const report = await service.saveReport(req.body);
      res.status(201).json({ success: true, data: report });
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  }

  async list(req, res) {
    try {
      const list = await service.listReports({ type: req.query.type, limit: parseInt(req.query.limit) || 50 });
      res.json({ success: true, data: list, count: list.length });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Failed to fetch reports' });
    }
  }

  async get(req, res) {
    try {
      const r = await service.getReport(req.params.id);
      res.json({ success: true, data: r });
    } catch (e) {
      res.status(404).json({ success: false, message: e.message });
    }
  }

  async health(req, res) { res.json({ status: 'healthy', service: 'report-service', time: new Date().toISOString() }); }
}

module.exports = new ReportController();
