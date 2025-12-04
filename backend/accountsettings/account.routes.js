const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../Auth/auth.controller");