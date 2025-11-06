const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const db = require("../db.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser")
const { validationResult } = require("express-validator");
const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();
app.use(cookieParser());




const register = async (req, res) => {
    
const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            message: "Validation failed",
            errors: errors.array()
        });
    }

    const {
        fname,
        lname,
        email,
        password,
        confirmpass,
        phone_number,
        company,
        type,
    } = req.body;

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

    const hashedPassword = await bcrypt.hash(password, 12);

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
    
const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            message: "Validation failed",
            errors: errors.array()
        });
    }
    
    const { email, phone_number, password } = req.body;
    const accessTokenSECRET = process.env.JWT_AccessToken_SECRET;
    const refreshTokenSECRET = process.env.JWT_Refresh_SECRET;


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
    const accessToken = jwt.sign({ id: userId }, accessTokenSECRET, {
        subject: "accessApi",
        expiresIn: "1h",
    });

    const refreshToken = jwt.sign({ id: userId }, refreshTokenSECRET,{
        subject: "RefreshToken",
        expiresIn: "7d"
    })

    await db.execute(
        "INSERT INTO refreshtokens (user_id, refresh_token, ip_address) VALUES (?,?,?)",
        [ userId, refreshToken, req.ip] 
    )

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, //not accessible in js
        //local host
        secure: false,
        //   production !!!!!!!!!!!!!!
        //secure: true,
        path: "/", // only send to this endpoint ( ALL endpoint)
        sameSite: "strict", // prevent CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ayam
    })


    return res.status(200).json({
        id: userId,
        email: email,
        newaccesstoken: accessToken,
        message: "User Logged in successfully",
    });
    } catch (error) {
        console.error("Error Logging user:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

const currentUser = async (req, res) => {
    try {
        const [user] = await db.execute("SELECT * FROM users WHERE id = ?", [
        req.user.id,
    ]);
    
    if (!user || user.length === 0) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
        id: user[0].id,
        name: user[0].fullname,
        email: user[0].email,
        phone_number: user[0].phone_number,
        type: user[0].type,
        company: user[0].company
    });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const refreshRoute = async (req,res) => {
    const refreshtoken = req.cookies.refreshToken;
    const accessTokenSECRET = process.env.JWT_AccessToken_SECRET;

    if(!refreshtoken) return res.status(401).json({ message: "No Refreshtokens" });

    const [rows] = await db.execute(
        "SELECT * FROM refreshtokens WHERE refresh_token = ?",
        [refreshtoken]
    )

    if(rows.length === 0) return res.status(403).json({ message: "invalid token" })

    jwt.verify(refreshtoken, process.env.JWT_Refresh_SECRET, async (err, user) => {
        if(err) return res.status(403).json({ message: "expired token"});


        await db.execute("DELETE FROM refreshtokens WHERE refresh_token = ?", [refreshtoken])
        const newaccesstoken = jwt.sign({ id: rows[0].user_id }, accessTokenSECRET, {expiresIn: "15m"});
        res.json({ newaccesstoken }) 
    })
}


async function ensureAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Access token not found!" });
    }
    const accessToken = authHeader.split(' ')[1];
    const accessTokenSECRET = process.env.JWT_AccessToken_SECRET;
    
    if (!accessToken) {
        return res.status(401).json({ message: "Access token not found!" });
    }   


    try {
        const decodedAccessToken = jwt.verify(accessToken,accessTokenSECRET);

        req.user = { id: decodedAccessToken.id };

        next();
    } catch (error) {
        return res.status(401).json({ message: "access token invalid or expired" });
    }
}

module.exports = { register, LoginUser, ensureAuthenticated, currentUser, refreshRoute };