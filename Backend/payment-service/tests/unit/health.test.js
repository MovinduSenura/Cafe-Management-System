const request = require('supertest');
const app = require('../../src/app');

describe('Health Check', () => {
  it('should return healthy status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body.status).toBe('healthy');
    expect(response.body.service).toBe('payment-service');
  });
});
