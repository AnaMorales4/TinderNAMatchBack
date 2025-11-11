const User = require("../models/user");
const { getMatches } = require("../controllers/matchesController"); // ajusta ruta si es distinta

jest.mock("../models/user");

describe("getMatches", () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: "user123" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return matches if user is found", async () => {
    const mockMatches = [
      { username: "ana123", name: "Ana", age: 28, profilePhoto: "ana.jpg" },
    ];
    const mockUser = { matches: mockMatches };

    User.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockUser),
    });

    await getMatches(req, res);

    expect(User.findById).toHaveBeenCalledWith("user123");
    expect(res.json).toHaveBeenCalledWith({ matches: mockMatches });
  });

  it("should return 404 if user not found", async () => {
    User.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    await getMatches(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: "User not found." });
  });

  it("should return 500 if there is a server error", async () => {
    User.findById.mockImplementation(() => ({
      populate: jest.fn().mockRejectedValue(new Error("DB error")),
    }));

    await getMatches(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ msg: "Error." })
    );
  });
});