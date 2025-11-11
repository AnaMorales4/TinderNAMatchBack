const express = require("express");
const { getUsers, createUsers, authenticatorUser, swipeUser, matchUser } = require("../controllers/users");
const {  getUserRules, isValid, createUsersRules } = require("../validators/userValidator");

const router = express.Router();

router.get("/users",  getUsers);

router.post('/users',createUsersRules,isValid,createUsers) //

router.post('/login',authenticatorUser,isValid,createUsers)

router.post('/users/:id',swipeUser)

router.get('/match_user/',matchUser)

module.exports = router;
