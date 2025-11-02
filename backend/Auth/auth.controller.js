const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const db = require("../db.js");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();


const register = async (req, res) => {

const {
    fname,
    lname,
    email,
    password,
    confirmpass,
    phone_number,
    company,
    type
} = req.body;

    if(
        !fname ||
        !lname ||
        !email ||
        !password ||
        !phone_number ||
        !company ||
        !type ||
        !confirmpass)
    {
        console.error("Information not Provided");
        return res.status(400).json({ message: "Information not provided" });
    }

    try {
    const [existingUser] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
        [email]
    );
    if (existingUser.length) {
        return res.status(400).json({ message: "Email already registered" });
    }

    if (password != confirmpass) {
        return res.status(400).json({ message: "Passwords Doesnt Match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [results] = await db.execute(
        `INSERT INTO users ( fname, lname, email, password_hashed, company, type, phone_number) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [fname, lname, email, hashedPassword, company, type, phone_number]
    );

    return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
    console.error("Error registering user:", error.message);
    return res.status(500).json({ message: "Server error" });
    }
};

const LoginUser = async (req, res) => {
    const { email, phone_number, password } = req.body;
    const SECRET = process.env.JWT_SECRET;
    
    if (!password) {
    return res.status(400).json({ message: "Password not provided" });
}

    if (!email && !phone_number) {
    return res.status(400).json({ message: "Email / Phone number Not Provided" });
    }

try {
    const [existingUser] = await db.execute(
      "SELECT * FROM users WHERE email = ? OR phone_number = ?",
        [email || null, phone_number || null]
    );
    if (existingUser.length === 0) {
        return res.status(400).json({ message: "User not registered" });
    }

    const user = existingUser[0]; //data of the user -> db returns: [data, extrainfo]

    const isMatch = await bcrypt.compare(password, user.password_hashed);
    if (!isMatch) {
        return res.status(400).json({ message: "Incorrect password" });
    }

    const userId = user.id;    
    //jwt
    const accessToken = jwt.sign({ userId: userId}, SECRET, { subject: 'accessApi', expiresIn: '12m'})


    return res.status(200).json({ 
        id: userId,
        email: email,
        accessToken,
        message: "User Logged in successfully" });  

    } catch (error) {
        console.error("Error Logging user:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
}

module.exports = { register, LoginUser };