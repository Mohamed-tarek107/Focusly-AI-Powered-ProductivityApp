const db = require("../db.js");

//API DESIGN: 

// Get all tasks	GET	/tasks	             Fetch all tasks
// Get one task	    GET	/tasks/:id	         View specific task
// Add new task	    POST /tasks	             Create a task
// Edit task	    PUT	/tasks/:id	         Update a task
// Delete one task  delete /deleteTask/:id   delete a task
//----------------------------------------------------------------------

//get request
const getAllTasks = async (req, res) => {
    const userId = req.user.user_id;
    
    try {
        const [results] = await db.execute(
            "SELECT * FROM tasks WHERE is_done = 0 AND user_id = ? ",
            [userId]
        )


        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(400).json({ message: "Error Loading Tasks" });
    }
}

//get request
const getTask = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.user_id;

    try {
        if (!id) {
            return res.status(400).json({ message: "Task ID is required" });
        }

    const [task] = await db.execute(
        "SELECT * FROM tasks WHERE task_id = ? AND user_id = ?",
        [id, user_id]
    )

        if(task.length == 0) return res.status(404).json({ message: "No tasks found" });

        res.status(200).json(task[0])
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(400).json({ message: "Error Loading Tasks" });
    }
}


//post request
const createTask = async (req,res) => {
    const userId = req.user.user_id;
    const priorities = ['Low', 'Medium', 'High', 'Critical'];
    const statuses = ['In Progress', 'Done', 'Overdue', 'Postponed'] 

    const {
        title, 
        task_description,
        priority,
        task_status,
        assigned_to, 
        start_date, 
        due_date
    } = req.body
    

    //=================================
    // Validations
    if( 
        !title ||
        !task_description ||
        !priority||
        !task_status||
        !assigned_to ||
        !start_date ||
        !due_date
    ){
        return res.status(500).json({ message: "Provide All Info"})
    }
    const isValidDate = (dateStr) => /^\d{4}-\d{2}-\d{2}$/.test(dateStr); // YYYY-MM-DD // Efteker 3shan el front

    if (!isValidDate(start_date)) {
        return res.status(400).json({ message: "Invalid start_date format. Use YYYY-MM-DD." });
    }

    if (!isValidDate(due_date)) {
        return res.status(400).json({ message: "Invalid due_date format. Use YYYY-MM-DD." });
    }

    if (new Date(due_date) < new Date(start_date)) {
        return res.status(400).json({ message: "due_date cannot be before start_date." });
    }

    if(!priorities.includes(priority)){
        return res.status(400).json({ message: "Invalid priority value" });
    }

    if(!statuses.includes(task_status)){
        return res.status(400).json({ message: "Invalid task_status value" });
    }
    if (assigned_to.length > 30) {
        return res.status(400).json({ message: "assigned_to too long (max 30 chars)" });
    }
    //==========================================

    try {
        const [result] = await db.execute(
            "INSERT INTO tasks (title, user_id, task_description, priority, task_status, assigned_to, start_date, due_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [title, userId, task_description, priority, task_status, assigned_to, start_date, due_date]
        )

        res.status(200).json({
            message: "Task Added successfully",
            id: result.insertId,
        });
    } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).json({ message: "Error adding task" });
    }
}


//put request
const editTask = async (req,res) => {
    const { id } = req.params;       
    const user_id = req.user.user_id; 
    const { title, task_description, priority, task_status, assigned_to } = req.body;        
    const priorities = ['Low', 'Medium', 'High', 'Critical'];
    const statuses = ['In Progress', 'Done', 'Overdue', 'Postponed'];


    try {
        const updates = {}
        if(title) updates.title = title
        if(task_description) updates.task_description = task_description
        if(priority){
            if(!priorities.includes(priority)){
                return res.status(400).json({ message: "Invalid priority value" });
            }
            updates.priority = priority;
        }
        if(task_status) {
            if(!statuses.includes(task_status)){
                return res.status(400).json({ message: "Invalid task_status value" });
            }
            updates.task_status = task_status;
        }
        if(assigned_to) updates.assigned_to = assigned_to
        

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No update data provided." });
        }

        const query = 
            "UPDATE tasks SET " +
            Object.keys(updates)
            .map((key) => `${key} = ?`)
            .join(", ") + 
            " WHERE task_id = ? AND user_id = ?";

            const values = [...Object.values(updates), id, user_id]
            const [result] = await db.execute(query, values)

            if(result.affectedRows === 0){
                return res.status(404).json({ message: "Task not found or not owned by user." })
            }
            const [updatedTask] = await db.execute(
            "SELECT * FROM tasks WHERE task_id = ? AND user_id = ?", [id, user_id]
            );

            res.json(updatedTask[0])

    }catch(error){
        console.error(error)
        res.status(500).json({ message: "Server Error"})
    }
}

//delete request
const deleteTask = async (req,res) => {
    const { id } = req.params;
    const user_id = req.user.user_id;

    try {
        if (!id){
            return res.status(400).json({ message: "Task ID is required" });
        }
        const [result] = await db.execute(
                "DELETE FROM tasks WHERE task_id = ? AND user_id = ?", 
                [id, user_id]
            )

            if (result.affectedRows === 0)
                return res.status(404).json({ message: "Task not found or not owned by user" });

        return res.status(200).json({ message: `Task with id: ${id} was deleted Successfully` })
    } catch (error) {
        console.error("Error Deleting task:", error);
        res.status(500).json({ message: "Error Deleting task" });
    }
}

const markDone = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.user_id;

try {
    const [result] = await db.execute(
        "UPDATE tasks SET is_done = 1 WHERE task_id = ? AND user_id = ?",
        [id, user_id]
    );

    if (result.affectedRows === 0)
        return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task marked as done" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDoneTasks = async (req,res) => {
    const userId = req.user.user_id;

    try {
        const [tasks] = await db.execute(
            "SELECT * FROM tasks WHERE user_id = ? AND is_done = 1",
            [userId]
        )

        res.status(200).json(tasks)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching done tasks" });
    }
}
module.exports = {getAllTasks, getTask, createTask, editTask, deleteTask, markDone, getDoneTasks}