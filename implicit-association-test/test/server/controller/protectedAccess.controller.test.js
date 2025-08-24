const express = require('express');
const request = require('supertest');
const fs = require('fs');
const path = require('path');
const adminController = require('../../../server/controllers/protectedAccess.controller');

describe('GET /admin', () => {
  let app;

  beforeAll(() => {
    app = express();

    app.get('/admin', (req, res) => {
      res.sendFile = (...args) => {
        const absPath = path.resolve(__dirname, '../../../client/html/admin.html');
        const html = fs.readFileSync(absPath, 'utf8');
        res.type('html').send(html);
      };
      adminController.getFirstPage(req, res);
    });
  });

  it('should return the admin.html file', async () => {
    const response = await request(app).get('/admin');

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    expect(response.text).toMatch(/<title>Admin<\/title>/);
  });
});
