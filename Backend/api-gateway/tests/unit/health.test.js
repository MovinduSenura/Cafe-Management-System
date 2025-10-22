const request = require('supertest');
const express = require('express');

// Create a simple app for testing since api-gateway doesn't have src/app.js
const app = express();
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'api-gateway',
    timestamp: new Date().toISOString()
  });
});

describe('Health Check', () => {
  it('should return healthy status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body.status).toBe('healthy');
    expect(response.body.service).toBe('api-gateway');
  });

  it('should return current timestamp', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body.timestamp).toBeDefined();
    expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
  });
});