import nodemailer from "nodemailer";
import {emailType} from '../constants.js';


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.USER,
        pass: process.env.PASS,
    },
});



async function sendEmail({to,subject,type,data}) {
    const info = await transporter.sendMail({
        from: process.env.USER, // sender address
        to: to.toString(), // list of receivers
        subject: subject, // Subject line
        html: emailType[type](data), // html body
    });

    console.log("Message sent: %s", info.messageId);
}

export {
    sendEmail,

}