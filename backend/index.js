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

const allowedOrigins = process.env.NODE_ENV === "production"
    ? ["https://your-frontend.com"]
    : ["http://localhost:4200"];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST","PUT","DELETE","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/tasks", tasksApi);
app.use("/api/ai", aiRoutes);
app.use("/api/accountSettings", AccountSettings);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

// Use PORT from env when available (common for deployed setups), default to 5000
const PORT = process.env.PORT || 5000;;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));