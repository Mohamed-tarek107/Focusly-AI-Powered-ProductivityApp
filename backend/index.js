require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("../backend/Auth/auth.routes")

const app = express();

app.use(cors({
    origin: "http://localhost:4200",
    credentials: true}));
app.use(express.json());

app.use("/api/auth", authRoutes) //base url


const PORT = process.env.PORT || 4200;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));