const express = require("express");
const { register, LoginUser , ensureAuthenticated , currentUser } = require("./auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", LoginUser);
router.get("/current", ensureAuthenticated, currentUser)
module.exports = router;