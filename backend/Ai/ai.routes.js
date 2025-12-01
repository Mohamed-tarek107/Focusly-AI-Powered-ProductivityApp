const express = require("express");
const router = express.Router();
const AiController = require("../Ai/ai.controller");



const { ensureAuthenticated } = require("../Auth/auth.controller");
const aiController = new AiController();

router.post("/chat", ensureAuthenticated, (req,res) => aiController.chat(req,res));
// router.post("/chat", (req,res) => aiController.chat(req,res));

module.exports = router