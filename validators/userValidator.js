const { query, body } = require("express-validator");
const { validationResult } = require("express-validator");

const getUserRules = [query("email").isEmail().escape()];

const createUsersRules = [
    body("email").notEmpty().escape().isEmail(),
    body("firstName").notEmpty().escape().isString(),
    body("lastName").notEmpty().escape().isString()
];

const isValid = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.status(422).json({
      errors: result.array(),
    });
  } else {
    next();
  }
};

module.exports = {
  getUserRules,
  isValid,
  createUsersRules
};
