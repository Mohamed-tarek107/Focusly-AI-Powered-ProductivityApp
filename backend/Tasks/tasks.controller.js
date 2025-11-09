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
            "SELECT * FROM tasks WHERE user_id = ?",
            [userId]
        )

        if (results.length === 0) {
            return res.status(404).json({ message: "No tasks found" });
        }

        console.log(`results: ${results}`)
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

        console.log(`results: ${task[0]}`)
        res.status(200).json(task[0])
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(400).json({ message: "Error Loading Tasks" });
    }
}


//post request
const createTask = async (req,res) => {
    const userId = req.user.user_id;
    
    const {
        title, 
        task_description,
        priority,
        task_status,
        assigned_to, 
        start_date, 
        due_date
    } = req.body
    
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
    
    try {
        await db.execute(
            "INSERT INTO tasks (title, user_id, task_description, priority, task_status, assigned_to, start_date, due_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [title, userId, task_description, priority, task_status, assigned_to, start_date, due_date]
        )

        res.status(200).json({ message: "Task Added successfully"})
    } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).json({ message: "Error adding task" });
    }
}


//put request
const editTask = async (req,res) => {
    const { id } = req.params;       
    const user_id = req.user.user_id; 
    const { title, description, priority, task_status, assigned_to } = req.body;        

    try {
        const updates = {}
        if(title) updates.title = title
        if(description) updates.description = description
        if(priority) updates.priority = priority
        if(task_status) updates.task_status = task_status
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

            res.json({ message: "Task updated successfully." })
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
            await db.execute(
                "DELETE FROM tasks WHERE task_id = ? AND user_id = ?", 
                [id, user_id]
            )
            return res.status(200).json({ message: `Task with id: ${id} was deleted Successfully` })
    } catch (error) {
        console.error("Error Deleting task:", error);
        res.status(500).json({ message: "Error Deleting task" });
    }
}
module.exports = {getAllTasks, getTask, createTask, editTask, deleteTask}