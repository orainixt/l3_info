jest.mock('../../../server/model/admin.model', () => ({
  model: {
    findById: jest.fn()
  }
}));

const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const Admin = require('../../../server/model/admin.model').model;
const jwtConfig = require('../../../server/config/jwt.config');
const { authentication, adminAuthentication } = require('../../../server/middlewares/authentication.middleware'); 

describe('Middlewares auth', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(cookieParser());
  });

  describe('authentication middleware', () => {
    it('should allow access if JWT is valid', async () => {
      const token = jwt.sign({ id: 'admin-id' }, jwtConfig.SECRET_TOKEN, { expiresIn: '1h' });

      app.get('/protected', authentication, (req, res) => {
        res.status(200).json({ userId: req.userId });
      });

      const res = await request(app)
        .get('/protected')
        .set('Cookie', [`token=${token}`]);

      expect(res.status).toBe(200);
      expect(res.body.userId).toBe('admin-id');
    });

    it('should redirect if JWT is invalid or missing', async () => {
      app.get('/protected', authentication, (req, res) => {
        res.status(200).send('OK');
      });

      const res = await request(app).get('/protected');

      expect(res.status).toBe(302);
      expect(res.header['location']).toBe('/html/login.html');
    });
  });

  describe('adminAuthentication middleware', () => {
    it('should allow access for super admin', async () => {
      Admin.findById.mockResolvedValue({ superAdmin: true });

      app.get('/admin', (req, res, next) => {
        req.userId = 'admin-id';
        next();
      }, adminAuthentication, (req, res) => {
        res.status(200).send('Bienvenue super admin');
      });

      const res = await request(app).get('/admin');

      expect(res.status).toBe(200);
      expect(res.text).toBe('Bienvenue super admin');
    });

    it('should deny access for non-super admin', async () => {
      Admin.findById.mockResolvedValue({ superAdmin: false });

      app.get('/admin', (req, res, next) => {
        req.userId = 'admin-id';
        next();
      }, adminAuthentication, (req, res) => {
        res.status(403).json({ message: 'Accès refusé : non super-admin' });
      });

      const res = await request(app).get('/admin');

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/non super-admin/);
    });
  });
});
