import nodemailer from "nodemailer";

// mail

const sendMyMail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, function (error) {
    if (error) {
      console.log(error.message);
    } else {
      console.log("Email sent");
    }
  });
};

export default sendMyMail;
