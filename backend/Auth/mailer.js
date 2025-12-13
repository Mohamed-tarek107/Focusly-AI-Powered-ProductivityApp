const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MYMAIL,
    pass: process.env.APP_PASS,
  },
});

const sendMail = async (to, verificationCode) => {
  try {
    await transporter.sendMail({
      from: {
        name: "Focusly App",
        address: process.env.MYMAIL,
      },
      to,
      subject: "Focusly Password Reset Code",
      html: `
        <p>Your verification code is:</p>
        <h2>${verificationCode}</h2>
        <p>This code expires in 5 minutes.</p>
        <p><strong>Abos edk matnsahosh tany 🥹</strong></p>
      `,
    });

    return true;
  } catch (error) {
    console.error("Mail error:", error);
    return false;
  }
};

module.exports = sendMail;
