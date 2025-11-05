const jwt = require("jsonwebtoken");
const { loginUser, registerUser } = require("../controllers/authController");
const User = require("../models/user");

jest.mock("../models/user");
jest.mock("jsonwebtoken");

describe("User Controller", () => {
  let req;
  let res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe("loginUser", () => {
    it("should return 404 if user not found", async () => {
      req.body = { email: "test@example.com", password: "123456" };
      User.findOne.mockResolvedValue(null);

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Usuario no encontrado",
      });
    });

    it("should return 401 if password is incorrect", async () => {
      req.body = { email: "test@example.com", password: "wrong" };
      User.findOne.mockResolvedValue({
        email: "test@example.com",
        password: "123456",
      });

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Contraseña incorrecta",
      });
    });

    it("should return 200 and token if login is successful", async () => {
      const mockUser = {
        _id: "123",
        name: "Test User",
        email: "test@example.com",
        password: "123456",
        age: 30,
        gender: "M",
        profilePhoto: "photo.jpg",
      };

      req.body = { email: "test@example.com", password: "123456" };
      User.findOne.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue("mock-token");

      await loginUser(req, res);

      expect(jwt.sign).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Login exitoso",
        token: "mock-token",
        user: {
          id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email,
          age: mockUser.age,
          gender: mockUser.gender,
          profilePhoto: mockUser.profilePhoto,
        },
      });
    });
  });

  describe("registerUser", () => {
    it("should return 400 if user already exists", async () => {
      req.body = { email: "test@example.com" };
      User.findOne.mockResolvedValue({ email: "test@example.com" });

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "El usuario ya está registrado",
      });
    });

    it("should register a new user and return 201 with token", async () => {
      const mockSave = jest.fn().mockResolvedValue();
      const mockUser = {
        _id: "123",
        name: "Test User",
        email: "test@example.com",
        password: "123456",
        age: 30,
        gender: "M",
        save: mockSave,
      };

      req.body = {
        name: "Test User",
        email: "test@example.com",
        password: "123456",
        age: 30,
        gender: "M",
      };

      User.findOne.mockResolvedValue(null);
      User.mockImplementation(() => mockUser);
      jwt.sign.mockReturnValue("mock-token");

      await registerUser(req, res);

      expect(mockSave).toHaveBeenCalled();
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Registro exitoso",
        token: "mock-token",
        user: {
          id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email,
          age: mockUser.age,
          gender: mockUser.gender,
        },
      });
    });

    it("should return 500 on server error", async () => {
      req.body = {
        name: "Test",
        email: "error@example.com",
        password: "pass",
        age: 25,
        gender: "F",
      };

      User.findOne.mockRejectedValue(new Error("DB Error"));

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error del servidor" });
    });
  });
});