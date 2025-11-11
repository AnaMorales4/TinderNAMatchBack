const ChatMessage = require("../models/ChatMessage");
const Match = require("../models/user"); // usuario con matches

const {
  getChatHistory,
  sendMessage,
} = require("../controllers/socketController"); // ajusta la ruta

jest.mock("../models/ChatMessage");
jest.mock("../models/user");

describe("Chat Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        senderId: "user1",
        receiverId: "user2",
        text: "Hola!",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe("getChatHistory", () => {
    it("should return 404 if any user is not found", async () => {
      Match.findById
        .mockResolvedValueOnce(null) // sender not found
        .mockResolvedValueOnce({ matches: ["user1"] });

      await getChatHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should return 403 if users are not matched", async () => {
      Match.findById
        .mockResolvedValueOnce({ matches: [] })
        .mockResolvedValueOnce({ matches: [] });

      await getChatHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Users must match before chatting",
      });
    });

    it("should return chat history if users are matched", async () => {
      req.body = {
        senderId: "user1",
        receiverId: "user2",
      };

      const chatHistory = [
        {
          text: "Hola",
          senderId: "user1",
          receiverId: "user2",
        },
      ];

      Match.findById
        .mockResolvedValueOnce({ matches: ["user2"] })
        .mockResolvedValueOnce({ matches: ["user1"] });

      const mockPopulate2 = jest.fn().mockResolvedValue(chatHistory);
      const mockPopulate1 = jest
        .fn()
        .mockReturnValue({ populate: mockPopulate2 });
      const mockSort = jest.fn().mockReturnValue({ populate: mockPopulate1 });

      ChatMessage.find.mockReturnValue({ sort: mockSort });

      await getChatHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(chatHistory);
    });
  });

  describe("sendMessage", () => {
    it("should return 404 if any user is not found", async () => {
      Match.findById
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ matches: ["user1"] });

      await sendMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should return 403 if users are not matched", async () => {
      Match.findById
        .mockResolvedValueOnce({ matches: [] })
        .mockResolvedValueOnce({ matches: [] });

      await sendMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Users must match before chatting",
      });
    });

    it("should send and return message if users are matched", async () => {
      req.body = {
        senderId: "user1",
        receiverId: "user2",
        text: "Hola",
      };

      const createdMessage = {
        _id: "msg1",
        senderId: "user1",
        receiverId: "user2",
        text: "Hola",
      };

      const populatedMessage = {
        ...createdMessage,
        senderId: { name: "Ana" },
        receiverId: { name: "Luis" },
      };

      Match.findById
        .mockResolvedValueOnce({ matches: ["user2"] })
        .mockResolvedValueOnce({ matches: ["user1"] });

      ChatMessage.create.mockResolvedValue(createdMessage);

      const mockPopulate2 = jest.fn().mockResolvedValue(populatedMessage);
      const mockPopulate1 = jest
        .fn()
        .mockReturnValue({ populate: mockPopulate2 });

      ChatMessage.findById.mockReturnValue({ populate: mockPopulate1 });

      await sendMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(populatedMessage);
    });

    it("should return 500 on error", async () => {
      Match.findById
        .mockResolvedValueOnce({ matches: ["user2"] })
        .mockResolvedValueOnce({ matches: ["user1"] });

      ChatMessage.create.mockRejectedValue(new Error("Create error"));

      await sendMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error sending message",
      });
    });
  });
});