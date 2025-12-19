const express = require("express");
const cors = require("cors");
const authRoutes = require('./Auth/auth.routes')
const tasksApi = require('./Tasks/tasks.routes')
const aiRoutes = require("./Ai/ai.routes");
const AccountSettings = require("./accountsettings/account.routes")
require("dotenv").config();
const cookieParser = require("cookie-parser");
const helmet = require("helmet")

const app = express();
app.use(helmet());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:4200",
    credentials: true,
    methods: ["GET", "POST","PUT","DELETE","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
// Base routes
app.get("/", (req, res) => res.send("Server is running..."));
app.use("/api/auth", authRoutes);
app.use("/api/tasks", tasksApi);
app.use("/api/ai", aiRoutes)
app.use("/accountSettings", AccountSettings)

// Use PORT from env when available (common for deployed setups), default to 5000
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));