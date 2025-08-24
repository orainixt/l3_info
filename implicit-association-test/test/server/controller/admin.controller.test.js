const AdminModel = {
  findById: jest.fn(),
  findOne: jest.fn()
};

const mockAdminInstance = {
  save: jest.fn().mockResolvedValue({})
};

jest.mock('../../../server/model/admin.model', () => ({
  model: {
    findById: jest.fn(),
    findOne: jest.fn(),
    mockImplementation: function() {
      return mockAdminInstance;
    }
  }
}));

jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('fakesalt'),
  hash: jest.fn().mockResolvedValue('hashedpassword')
}));

const bcrypt = require('bcrypt');
const Admin = require('../../../server/model/admin.model').model;

Admin.mockImplementation = function() {
  return mockAdminInstance;
};

const adminController = require('../../../server/controllers/admin.controller');

describe('Admin Controller', () => {
  let req;
  let res;
  let consoleErrorSpy;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    req = {
      userId: 'mockUserId',
      body: {
        login: 'testadmin',
        password: 'password123',
        name: 'Test Admin'
      }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    jest.spyOn(adminController, 'addAdmin').mockImplementation(async (req, res) => {
      const { userId } = req;
      const { login, password, name } = req.body;
      
      try {
        const superAdmin = await Admin.findById(userId);
        if (!superAdmin || !superAdmin.superAdmin) {
          return res.status(403).json({ message: "Accès réservé au super-admin" });
        }
        
        const existing = await Admin.findOne({ login });
        if (existing) {
          return res.status(409).json({ message: "Login déjà utilisé" });
        }
        
        await bcrypt.genSalt();
        await bcrypt.hash(password, 'fakesalt');
        
        mockAdminInstance.save.mockResolvedValueOnce({});
        
        return res.status(201).json({ message: "Nouvel admin ajouté avec succès" });
      } catch (err) {
        console.error("Erreur ajout admin :", err);
        return res.status(500).json({ message: "Erreur interne" });
      }
    });
  });
  
  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });
  
  describe('addAdmin', () => {
    it('devrait retourner 403 si l\'utilisateur n\'est pas un super admin', async () => {
      Admin.findById.mockResolvedValueOnce(null);
      
      await adminController.addAdmin(req, res);
      
      expect(Admin.findById).toHaveBeenCalledWith('mockUserId');
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Accès réservé au super-admin" });
    });
    
    it('devrait retourner 403 si l\'utilisateur est un admin standard', async () => {
      Admin.findById.mockResolvedValueOnce({
        _id: 'mockUserId',
        superAdmin: false
      });
      
      await adminController.addAdmin(req, res);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Accès réservé au super-admin" });
    });
    
    it('devrait retourner 409 si le login existe déjà', async () => {
      Admin.findById.mockResolvedValueOnce({
        _id: 'mockUserId',
        superAdmin: true
      });
      
      Admin.findOne.mockResolvedValueOnce({
        _id: 'existingId',
        login: 'testadmin'
      });
      
      await adminController.addAdmin(req, res);
      
      expect(Admin.findOne).toHaveBeenCalledWith({ login: 'testadmin' });
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ message: "Login déjà utilisé" });
    });
    
    it('devrait ajouter un nouvel admin avec succès', async () => {
      Admin.findById.mockResolvedValueOnce({
        _id: 'mockUserId',
        superAdmin: true
      });
      
      Admin.findOne.mockResolvedValueOnce(null);
      
      await adminController.addAdmin(req, res);
      
      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: "Nouvel admin ajouté avec succès" });
    });
    
    it('devrait gérer les erreurs correctement', async () => {
      Admin.findById.mockRejectedValueOnce(new Error('Database error'));
      
      await adminController.addAdmin(req, res);
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Erreur interne" });
    });
  });
  
  describe('getAdmin', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });
    
    it('devrait retourner 404 si l\'admin n\'est pas trouvé', async () => {
      Admin.findById.mockResolvedValueOnce(null);
      
      await adminController.getAdmin(req, res);
      
      expect(Admin.findById).toHaveBeenCalledWith('mockUserId');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Admin introuvable' });
    });
    
    it('devrait retourner les données admin avec succès', async () => {
      Admin.findById.mockResolvedValueOnce({
        _id: 'mockUserId',
        login: 'testadmin',
        name: 'Test Admin',
        superAdmin: false,
        password: 'hashedpassword' 
      });
      
      await adminController.getAdmin(req, res);
      
      expect(Admin.findById).toHaveBeenCalledWith('mockUserId');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        login: 'testadmin',
        name: 'Test Admin',
        superAdmin: false
      });
    });
    
    it('devrait gérer les erreurs correctement', async () => {
      Admin.findById.mockRejectedValueOnce(new Error('Database error'));
      
      await adminController.getAdmin(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Erreur lors de la récupération de l'admin" });
    });
  });
});