const db = require("../db.js")

async function createTask(data, userId) {
    const { title, task_description, priority, task_status, assigned_to, start_date, due_date } = data

    const [result] = await db.execute(
        "INSERT INTO tasks (title, user_id, task_description, priority, task_status, assigned_to, start_date, due_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [title, userId, task_description, priority, task_status, assigned_to, start_date, due_date]
    )
}

module.exports = { createTask }