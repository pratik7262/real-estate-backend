const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host:'smtp.gmail.com',
      service:'gmail',
      port: 465,
      secure: true,
      auth: {
        user: 'pratikshinde7262@gmail.com',
        pass: 'gsxlxwpenhpussor',
      },
    });

    await transporter.sendMail({
      from: 'pratikshinde7262@gmail.com',
      to: email,
      subject: subject,
      text: text,
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

module.exports = sendEmail;

