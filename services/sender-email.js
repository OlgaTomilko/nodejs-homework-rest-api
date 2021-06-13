const sgMail = require("@sendgrid/mail");
const nodemailer = require("nodemailer");
const emailConfig = require("../config/config");
require("dotenv").config();

class CreateSenderSendgrid {
  async send(msg) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    return await sgMail.send({ ...msg, from: emailConfig.email.sendgrid });
  }
}

class CreateSenderNodemailer {
  async send(msg) {
    const config = {
      // host: "smpt.meta.ua",
      // port: 465,
      // secure: true,
      // auth: {
      //   user: emailConfig.email.nodemailer,
      //   pass: process.env.PASSWORD,
      // },
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "olga.tomilko.mk@gmail.com",
        pass: "alik12042017",
      },
    };
    const transporter = nodemailer.createTransport(config);
    const emailOptions = {
      from: emailConfig.email.nodemailer,
      ...msg,
    };
    return await transporter.sendMail(emailOptions);
  }
}

module.exports = { CreateSenderSendgrid, CreateSenderNodemailer };
