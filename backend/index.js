const express = require("express");
const cors = require("cors");
authRoutes = require('./Auth/auth.routes')
tasksApi = require('./Tasks/tasks.routes')
require("dotenv").config();
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:4200",
    credentials: true,
    methods: ["GET", "POST","PUT","DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
// Base routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", tasksApi);

// Use PORT from env when available (common for deployed setups), default to 5000
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));