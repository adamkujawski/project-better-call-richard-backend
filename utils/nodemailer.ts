import nodemailer from "nodemailer";
import { nodemailerConfig } from "../config/nodemailer.config";

const smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  host: nodemailerConfig.host,
  port: nodemailerConfig.port,
  auth: {
    user: nodemailerConfig.auth.user,
    pass: nodemailerConfig.auth.pass,
  },
});

export const send = async (
  clientEmail: string,
  brand: string,
  model: string,
  registrationNo: string,
  subject: string,
  html: string
): Promise<void> => {
  const mailOptions = {
    from: "<richard@better-call-richard.com>",
    to: `<${clientEmail}>`,
    subject: subject,
    // text: 'hello',
    html: html,
  };

  await smtpTransport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent: " + info.response + info.messageId);
    }
  });
};
