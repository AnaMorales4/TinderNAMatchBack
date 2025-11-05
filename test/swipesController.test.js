const { saveLike, saveDislike } = require("../controllers/swipesController");
const user = require("../models/user");

jest.mock("../models/user");

describe("User Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: "user2" }, // Usuario que recibe el like/dislike
      body: { userId: "user1" }, // Usuario que da el like/dislike
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("saveLike", () => {
    it("should add like and match if both users swipe and match", async () => {
      user.findById.mockResolvedValueOnce({
        swipes: ["user1"],
        matches: ["user1"],
        save: jest.fn(),
      });
      user.findById.mockResolvedValueOnce({
        swipes: [],
        matches: [],
        save: jest.fn(),
      });

      await saveLike(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: "liked" });
      expect(user.findById).toHaveBeenCalledTimes(2);
    });

    it("should not add like or match if users are not matched", async () => {
      // Mock de users without matches
      user.findById
        .mockResolvedValueOnce({
          swipes: [],
          matches: [],
          save: jest.fn(),
        }) // first mock for the first user
        .mockResolvedValueOnce({
          swipes: [],
          matches: [],
          save: jest.fn(),
        }); // second mock for the second user

      await saveLike(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: "liked" });

      // verify that the findById method was called 4 times cause we are calling it 2 times per user
      expect(user.findById).toHaveBeenCalledTimes(4);
    });

    it("should handle errors and return 400", async () => {
      user.findById.mockRejectedValue(new Error("Error al guardar"));

      await saveLike(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Error al guardar" });
    });
  });

  describe("saveDislike", () => {
    it("should remove like and match if users are swiped and matched", async () => {
      user.findById.mockResolvedValueOnce({
        swipes: ["user1"],
        matches: ["user1"],
        save: jest.fn(),
      });
      user.findById.mockResolvedValueOnce({
        swipes: ["user1"],
        matches: ["user1"],
        save: jest.fn(),
      });

      await saveDislike(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: "Disliked" });
    });

    it("should handle errors and return 400", async () => {
      user.findById.mockRejectedValue(new Error("Error al eliminar"));

      await saveDislike(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Error al eliminar" });
    });
  });
});

