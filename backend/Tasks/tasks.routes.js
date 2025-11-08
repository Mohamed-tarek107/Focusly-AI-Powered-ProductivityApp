const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../Auth/auth.controller");
const { getAllTasks, getTask, createTask, editTask, deleteTask } = require("./tasks.controller")


router.get("/getAllTasks", ensureAuthenticated, getAllTasks)
router.get("/getTask/:id", ensureAuthenticated, getTask)
router.post("/createTask", ensureAuthenticated, createTask)
router.put("/editTask/:id", ensureAuthenticated, editTask)
router.delete("/deleteTask/:id", ensureAuthenticated, deleteTask)

module.exports = router