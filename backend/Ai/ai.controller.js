const GeminiService = require("./gemini-service")
const {createTask} = require('../Tasks/taskService')
require("dotenv").config()

class AiController {
    constructor(){
        this.gemini = new GeminiService(process.env.GEMINI_API_KEY)
    }

    async chat(req,res){
        try {
            const { msg, history = []} = req.body;

            if(!msg){
                return res.status(400).json({ error: "Message is required" });
            }

            const aiReply = await this.gemini.sendMessage(msg, history)
            let parsedReply;
            try {
                parsedReply = JSON.parse(aiReply);
            } catch {
                parsedReply = { message: aiReply };
            }

            const newHistory = [
                ...history,
                { role: "user", text: msg },
                { role: "model", text: parsedReply.message || aiReply, command: parsedReply.command || null}
            ];
            

            if (parsedReply.command === "CreateTask") {
                const createdTask = await createTask(parsedReply, req.user.user_id );
                return res.json({ 
                    message: parsedReply.message,
                    task: createdTask,
                    newHistory: newHistory});
            }

            return res.json({
                message: aiReply,
                newHistory: newHistory
            })

        } catch (error) {
            console.error("AI ERROR:", error);
            return res.status(500).json({
                error: "AI Chat failed",
                details: error.message
            });
        }
    }
}

module.exports = AiController;