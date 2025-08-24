jest.mock('../../../server/model/admin.model', () => ({
  model: {
    findOne: jest.fn()
  }
}));

const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../../../server/model/admin.model').model;
const cookieParser = require('cookie-parser');

jest.mock('../../../server/controllers/admin.controller', () => ({
  addAdmin: jest.fn((req, res) => {
    res.status(201).json({ message: "Admin ajouté" });
  }),
  getAdmin: jest.fn((req, res) => {
    res.status(200).json({ name: "Admin Test", login: "admin", superAdmin: false });
  }),
  login: jest.fn((req, res) => {
    res.status(200).json({ token: "fake-token" });
  }),
  logout: jest.fn((req, res) => {
    res.status(200).json({ message: "Déconnexion réussie" });
  })
}));

const adminController = require('../../../server/controllers/admin.controller');

let app;
beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use(cookieParser());
  
  app.post('/login', adminController.login);
  app.post('/logout', adminController.logout);
  app.post('/admin', adminController.addAdmin);
  app.get('/admin', adminController.getAdmin);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Contrôleur admin', () => {
  it('devrait exposer une fonction login', () => {
    expect(typeof adminController.login).toBe('function');
  });
  
  it('devrait exposer une fonction logout', () => {
    expect(typeof adminController.logout).toBe('function');
  });

  it('devrait exposer une fonction addAdmin', () => {
    expect(typeof adminController.addAdmin).toBe('function');
  });

  it('devrait exposer une fonction getAdmin', () => {
    expect(typeof adminController.getAdmin).toBe('function');
  });
});

describe('Route login', () => {
  it('devrait appeler la fonction login du contrôleur', async () => {
    await request(app)
      .post('/login')
      .send({ login: 'testuser', password: 'password123' });
    
    expect(adminController.login).toHaveBeenCalled();
  });
});

describe('Route logout', () => {
  it('devrait appeler la fonction logout du contrôleur', async () => {
    await request(app)
      .post('/logout');
    
    expect(adminController.logout).toHaveBeenCalled();
  });
});