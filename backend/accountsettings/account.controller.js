const db = require("../db.js");
const bcrypt = require("bcryptjs");

const editInfo = async (req,res) => {
    const  id  = req.user.user_id

    const { fullname, email, fname, lname, phone_number } = req.body

    try {
        const updates = {}

        if(fullname) updates.fullname = fullname;
        if(email) updates.email = email;
        if(fname) updates.fname = fname;
        if(lname) updates.lname = lname;
        if(phone_number) updates.phone_number = phone_number;
        

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No update data provided." });
        }


        const query = "UPDATE users SET " + Object.keys(updates).map((key) => `${key} = ?`).join(', ') +
        " WHERE id = ?"

        const values = [...Object.values(updates), id]
        const [result] = await db.execute(query, values)

        if(result.affectedRows === 0){
                return res.status(404).json({ message: "User not found"})
            }

            const [updatedTask] = await db.execute(
            "SELECT * FROM users WHERE id = ?", [ id ]
            );

            return res.json(updatedTask[0])
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Server Error"})
        }
}

const deleteAccount = async (req,res) => {
    const id = req.user.user_id;

    try {
        await db.execute("DELETE FROM refreshtokens WHERE user_id = ?", [id])
        await db.execute("DELETE FROM notes WHERE user_id = ?", [id])
        await db.execute("DELETE FROM tasks WHERE user_id = ?", [id])
        const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id])
    
    
    if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({ message: "Account Deleted Successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
    
}

const changePass = async (req,res) => {
    const  id  = req.user.user_id
    const {currentPass, NewPass, ConfirmPass} = req.body;

    if(!currentPass){
        return res.status(400).json({message: " Need current password "});
    }
    if(!NewPass || !ConfirmPass){
        return res.status(400).json({ message: "Provide New pass and its confirmation" });
    }

    if(NewPass !== ConfirmPass){
        return res.status(400).json({ message: "new Password dont match the confirmation" });
    }

    try {
    const [[user]] = await db.execute("SELECT password_hashed FROM users WHERE id = ?", [id])
    const verify = await bcrypt.compare(currentPass, user.password_hashed)

    if(!verify) return res.status(400).json({ message: "current password is not correct" });
    

    const hashedNew = await bcrypt.hash(NewPass, 10)
    await db.execute("UPDATE users SET password_hashed = ? WHERE id = ?",[hashedNew, id])

    return res.status(200).json({ message: "Password Changed Successfully", })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

module.exports = { changePass, editInfo, deleteAccount }