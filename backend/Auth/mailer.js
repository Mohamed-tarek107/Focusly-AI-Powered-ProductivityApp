const nodemailer = require("nodemailer");
require("dotenv").config()


async function mailer(sendto) {
    const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 3,
    secure: false, 
    auth: {
    user: "maddison53@ethereal.email",
    pass: "jn7jnAPss4f63QBp6D",
    },
});




}
