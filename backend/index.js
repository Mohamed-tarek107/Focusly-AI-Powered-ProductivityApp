import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./Auth/auth.routes.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:4200",
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/api/auth", authRoutes); //base url

const PORT = process.env.PORT || 4200;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));