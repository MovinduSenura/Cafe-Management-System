const request = require('supertest');
const app = require('../../server');
const { setupTestDB, teardownTestDB, clearTestDB } = require('../setup');

describe('Health Check Endpoints', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('environment');
    });
  });

  describe('GET /api/v1/customers', () => {
    it('should return customers with pagination', async () => {
      const response = await request(app)
        .get('/api/v1/customers')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('customers');
      expect(response.body.data).toHaveProperty('pagination');
    });
  });
});