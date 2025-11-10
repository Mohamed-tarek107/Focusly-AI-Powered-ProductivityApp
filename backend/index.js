const express = require("express");
const cors = require("cors");
authRoutes = require('./Auth/auth.routes')
tasksApi = require('./Tasks/tasks.routes')
require("dotenv").config();
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:4200" || "https://48d72dp2-4200.euw.devtunnels.ms",
    credentials: true,
    methods: ["GET", "POST","PUT","DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/api/auth ", authRoutes); //base url
app.use("/api/tasks", tasksApi  );  

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));