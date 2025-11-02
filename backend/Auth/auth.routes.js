const express = require("express");
const { register, LoginUser } = require("./auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", LoginUser);

module.exports = router;