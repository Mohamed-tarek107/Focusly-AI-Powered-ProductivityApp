const bcrypt = require("bcryptjs");
const db = require("../db.js");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const sendMail = require("./mailer.js");
const crypto = require("crypto");

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
        phone_number = null,
        company = null,
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

    await db.execute(
        `INSERT INTO users ( fname, lname, email, password_hashed, company, type, phone_number) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [fname, lname, email, hashedPassword, company, type, phone_number]
    );

        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Register error:", error);
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
    const [existingUser] = await db.execute("SELECT * FROM users WHERE email = ? OR phone_number = ?",[email || null, phone_number || null])
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
        secure: true,
        path: "/", // only send to this endpoint ( ALL endpoint)
        sameSite: "strict", // prevent CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ayam
    })
    res.cookie("accessToken", accessToken, {
        httpOnly: true, 
        secure: true,
        path: "/",
        sameSite: "strict", 
        maxAge: 15 * 60 * 1000 
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
        fullname: user[0].fullname,
        email: user[0].email,
        phone_number: user[0].phone_number,
        type: user[0].type,
        company: user[0].company,
        username: user[0].username,
        fname: user[0].fname,
        lname: user[0].lname,
        bio: user[0].bio,
        created_at: user[0].created_at
    });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const emailVerification = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const [existingUser] = await db.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if(existingUser.length == 0){
            return res.status(400).json({ message: "User not registered" });
        }

        const { code, expiresAt } = generateVerification();
        const hashedCode = crypto
            .createHash("sha256")
            .update(code)
            .digest("hex");
        
        const {reset_token, reset_token_expires} = generateResetTokens();
        const resetToken = crypto
            .createHash("sha256")
            .update(reset_token)
            .digest("hex");

        await db.execute(
            `UPDATE users 
            SET reset_code = ?, reset_expires = ?, reset_token = ?, reset_token_expires = ?
            WHERE email = ?`,
            [hashedCode, expiresAt, resetToken, reset_token_expires, email]
        );

        await sendMail(email, code);

        return res.status(200).json({ 
            message: "Verification code sent to email",
            resetToken: reset_token
        });
    } catch (error) {
        console.error("Email verification error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}
const forgetPass = async (req,res) => {
    try {
        const { code, token } = req.body;

        if(!code || !token){
            return res.status(400).json({ message: "Code and token required" });
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const [rows] = await db.execute(
            "SELECT id, reset_code, reset_expires, reset_token_expires FROM users WHERE reset_token = ?",
            [hashedToken]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: "Invalid token" });
        }

        const hashedCode = crypto
            .createHash("sha256")
            .update(code)
            .digest("hex");

        // Convert datetime to timestamp for comparison
        const tokenExpires = new Date(rows[0].reset_token_expires).getTime();
        const codeExpires = new Date(rows[0].reset_expires).getTime();
        const now = Date.now();

        if(tokenExpires < now){
            return res.status(400).json({ message: "Reset token expired" });
        }
        if(rows[0].reset_code !== hashedCode){
            return res.status(400).json({ message: "Invalid verification code" });
        }

        if (codeExpires < now) {
            return res.status(400).json({ message: "Verification code expired" });
        }
        await db.execute(
            "UPDATE users SET reset_code = NULL, reset_expires = NULL WHERE reset_token = ?",
            [hashedToken]
        );
        res.status(200).json({ message: "Code verified successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}

const changePassAfterReset = async (req,res) => {
    const { token, NewPass, ConfirmPass } = req.body;

    if(!NewPass || !ConfirmPass){
        return res.status(400).json({ message: "Provide new password and confirmation" });
    }

    if(NewPass !== ConfirmPass){
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");
        
        const [rows] = await db.execute(
            "SELECT reset_token_expires FROM users WHERE reset_token = ?",
            [hashedToken]
        );
        
        if (rows.length === 0) {
            return res.status(400).json({ message: "Invalid token" });
        }

        // Convert datetime to timestamp for comparison
        const tokenExpires = new Date(rows[0].reset_token_expires).getTime();
        const now = Date.now();

        if(tokenExpires < now){
            return res.status(400).json({ message: "Reset token expired" });
        }

        const hashedNew = await bcrypt.hash(NewPass, 10);
        
        await db.execute(
            "UPDATE users SET password_hashed = ?, reset_token = NULL, reset_token_expires = NULL WHERE reset_token = ?",
            [hashedNew, hashedToken]
        );
        
        return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Change password error:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

const logout = async (req,res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(400).json({ message: "No refresh token found" });
        }

        
        await db.execute(
            "DELETE FROM refreshtokens WHERE refresh_tokens = ?",
            [refreshToken]
        );

        res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: 'strict' });
        res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: 'strict' });

        return res.status(200).json({ message: "Logged Out" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
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


        const newRefreshToken = jwt.sign(
                { id: rows[0].user_id }, 
                refreshTokenSECRET,
                { subject: "RefreshToken", expiresIn: "7d" }
            );

            //  Replace old with new
            await db.execute("DELETE FROM refreshtokens WHERE refresh_token = ?", [refreshtoken]);
            await db.execute(
                "INSERT INTO refreshtokens (user_id, refresh_token, ip_address) VALUES (?, ?, ?)",
                [rows[0].user_id, newRefreshToken, req.ip]
            );

            //  Update cookie
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            const newaccesstoken = jwt.sign(
                { id: rows[0].user_id }, 
                accessTokenSECRET, 
                { expiresIn: "15m" }
            );
        res.json({ newaccesstoken }) 
    })
}


async function ensureAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.warn('Authorization header missing or malformed');
        return res.status(401).json({ message: "Access token not found!" });
    }
    const accessToken = authHeader.split(' ')[1];
    const accessTokenSECRET = process.env.JWT_AccessToken_SECRET;
    
    if (!accessToken) {
        return res.status(401).json({ message: "Access token not found!" });
    }   


    try {
        const decodedAccessToken = jwt.verify(accessToken,accessTokenSECRET);

        // Provide both `id` and `user_id` to support different handlers
        req.user = { id: decodedAccessToken.id, user_id: decodedAccessToken.id };

        next();
    } catch (error) {
        return res.status(401).json({ message: "access token invalid or expired" });
    }
}

// Helpers
function generateVerification() {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    // Generate 6-digit code using randomBytes instead of randomInt
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return {
        code: code,
        expiresAt: expiresAt.toISOString().slice(0, 19).replace('T', ' ') // MySQL datetime format
    };
}

function generateResetTokens() {
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    return {
        reset_token: crypto.randomBytes(32).toString("hex"),
        reset_token_expires: expiresAt.toISOString().slice(0, 19).replace('T', ' ') // MySQL datetime format
        };
    }


module.exports = {  
    register,
    LoginUser,
    ensureAuthenticated,
    currentUser,
    refreshRoute,
    forgetPass,
    emailVerification, 
    changePassAfterReset,
    logout
};
