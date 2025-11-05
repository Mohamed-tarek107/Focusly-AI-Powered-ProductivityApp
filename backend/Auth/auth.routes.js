const express = require("express");
const { register, LoginUser , ensureAuthenticated , currentUser, refreshRoute } = require("./auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", LoginUser);
router.get("/current", ensureAuthenticated, currentUser)
router.post("/refresh-token", refreshRoute)
module.exports = router;