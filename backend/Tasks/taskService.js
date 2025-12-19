const db = require("../db.js");

// Allowed values based on HTTP controller
const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const STATUSES = ["In Progress", "Done", "Overdue", "Postponed"];

function normalizePriority(p) {
    if (!p) return "Medium";
    const map = {
        low: "Low",
        medium: "Medium",
        high: "High",
        critical: "Critical",
    };
    const key = String(p).toLowerCase();
    return map[key] || p;
}

function normalizeStatus(s) {
    if (!s) return "In Progress";
    const lowered = String(s).toLowerCase();
    if (lowered === "in progress") return "In Progress";
    return s;
}

function isValidDateStr(dateStr) {
    return /^\d{4}-\d{2}-\d{2}$/.test(String(dateStr));
}

function toDate(dateStr) {
    const [y, m, d] = String(dateStr).split("-").map(Number);
    return new Date(y, m - 1, d);
}

function sanitize(text) {
    if (text === undefined || text === null) return text;
    return String(text).trim();
}

async function createTask(data, userId) {
    let {
        title,
        task_description,
        priority,
        task_status,
        assigned_to,
        start_date,
        due_date,
    } = data;

    title = sanitize(title);
    task_description = sanitize(task_description) || "N/A";
    assigned_to = sanitize(assigned_to) || "Me";
    priority = normalizePriority(priority);
    task_status = normalizeStatus(task_status);

    if (!title) {
        throw new Error("Title is required");
    }
    if (!start_date || !due_date) {
        throw new Error("start_date and due_date are required");
    }
    if (!isValidDateStr(start_date)) {
        throw new Error("Invalid start_date format. Use YYYY-MM-DD.");
    }
    if (!isValidDateStr(due_date)) {
        throw new Error("Invalid due_date format. Use YYYY-MM-DD.");
    }
    if (toDate(due_date) < toDate(start_date)) {
        throw new Error("due_date cannot be before start_date.");
    }
    if (!PRIORITIES.includes(priority)) {
        throw new Error("Invalid priority value");
    }
    if (task_status !== "In Progress") {
        throw new Error("task_status must be 'In Progress' for AI-created tasks");
    }
    if (assigned_to.length > 30) {
        throw new Error("assigned_to too long (max 30 chars)");
    }

    const [result] = await db.execute(
        "INSERT INTO tasks (title, user_id, task_description, priority, task_status, assigned_to, start_date, due_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
            title,
            userId,
            task_description,
            priority,
            task_status,
            assigned_to,
            start_date,
            due_date,
        ]
    );

    const [rows] = await db.execute(
        "SELECT * FROM tasks WHERE task_id = ?",
        [result.insertId]
    );
    return rows[0];
}

module.exports = { createTask };