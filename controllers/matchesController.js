const User = require("../models/user");

exports.getMatches = async (req, res) => {
    const { id: userId } = req.params;
  
    try {
      const user = await User.findById(userId).populate(
        "matches",
        "username name age profilePhoto"
      );
  
      if (!user) {
        return res.status(404).json({ msg: "User not found." });
      }
  
      res.json({ matches: user.matches });
    } catch (error) {
      res.status(500).json({ msg: "Error.", error });
    }
  };