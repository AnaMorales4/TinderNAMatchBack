const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
  } = require("../controllers/userController");
  const User = require("../models/user");
  
  jest.mock("../models/user"); // Mock User
  
  describe("User Controller", () => {
    let req, res;
  
    beforeEach(() => {
      req = { body: {}, params: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });
  
    describe("createUser", () => {
      it("should return 400 if there's an error", async () => {
        const errorMessage = "Validation Error";
        req.body = { name: "John" };
  
        User.prototype.save = jest
          .fn()
          .mockRejectedValue(new Error(errorMessage));
  
        await createUser(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
      });
    });
  
    describe("getAllUsers", () => {
      it("should return a list of users", async () => {
        const users = [{ name: "John" }, { name: "Jane" }];
        User.find = jest.fn().mockResolvedValue(users);
  
        await getAllUsers(req, res);
  
        expect(res.json).toHaveBeenCalledWith(users);
      });
  
      it("should return 500 if there's an error", async () => {
        const errorMessage = "Database Error";
        User.find = jest.fn().mockRejectedValue(new Error(errorMessage));
  
        await getAllUsers(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
      });
    });
  
    describe("getUserById", () => {
      it("should return a user by ID", async () => {
        const user = { name: "John", _id: "123" };
        req.params.id = "123";
        User.findById = jest.fn().mockResolvedValue(user);
  
        await getUserById(req, res);
  
        expect(res.json).toHaveBeenCalledWith(user);
      });
  
      it("should return 404 if user is not found", async () => {
        req.params.id = "123";
        User.findById = jest.fn().mockResolvedValue(null);
  
        await getUserById(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
      });
  
      it("should return 500 if there's an error", async () => {
        const errorMessage = "Database Error";
        req.params.id = "123";
        User.findById = jest.fn().mockRejectedValue(new Error(errorMessage));
  
        await getUserById(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
      });
    });
  
    describe("updateUser", () => {
      it("should update the user and return the updated user", async () => {
        const updatedUser = { name: "John", email: "john@example.com" };
        req.params.id = "123";
        req.body = updatedUser;
        User.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedUser);
  
        await updateUser(req, res);
  
        expect(res.json).toHaveBeenCalledWith(updatedUser);
      });
  
      it("should return 404 if user is not found", async () => {
        req.params.id = "123";
        req.body = { name: "John" };
        User.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
  
        await updateUser(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
      });
  
      it("should return 400 if there's an error", async () => {
        const errorMessage = "Validation Error";
        req.params.id = "123";
        req.body = { name: "John" };
        User.findByIdAndUpdate = jest
          .fn()
          .mockRejectedValue(new Error(errorMessage));
  
        await updateUser(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
      });
    });
  
    describe("deleteUser", () => {
      it("should delete a user and return a success message", async () => {
        req.params.id = "123";
        const successMessage = { message: "User successfully deleted" };
        User.findByIdAndDelete = jest.fn().mockResolvedValue(successMessage);
  
        await deleteUser(req, res);
  
        expect(res.json).toHaveBeenCalledWith(successMessage);
      });
  
      it("should return 404 if user is not found", async () => {
        req.params.id = "123";
        User.findByIdAndDelete = jest.fn().mockResolvedValue(null);
  
        await deleteUser(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
      });
  
      it("should return 500 if there's an error", async () => {
        const errorMessage = "Database Error";
        req.params.id = "123";
        User.findByIdAndDelete = jest
          .fn()
          .mockRejectedValue(new Error(errorMessage));
  
        await deleteUser(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
      });
    });
  })