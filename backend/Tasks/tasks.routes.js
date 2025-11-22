const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../Auth/auth.controller");
const { getAllTasks, getTask, createTask, editTask, deleteTask, markDone, getDoneTasks } = require("./tasks.controller")

router.use(ensureAuthenticated);

router.get("/getAllTasks", getAllTasks)
router.get("/getTask/:id", getTask)
router.post("/createTask", createTask)
router.put("/editTask/:id", editTask)
router.delete("/deleteTask/:id", deleteTask)
router.put("/markDone/:id", markDone)
router.get("/getDoneTasks", getDoneTasks)
module.exports = router