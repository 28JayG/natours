const nodemailer = require('nodemailer');

const catchAsync = require('./catch-async');

const sendEmail = catchAsync(async (options) => {
  //create a transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //define the email options
  const mailOptions = {
    from: 'Jay Gandhi<jaygandhi.32@outlook.com',
    to: options.email,
    subject: options.subject,
    text: options.text,
  };
  //sendEmail with nodemailer
  await transporter.sendMail(mailOptions);
});

module.exports = sendEmail;
