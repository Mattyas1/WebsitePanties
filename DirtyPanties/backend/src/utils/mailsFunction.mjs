import nodemailer from 'nodemailer'
import {EMAIL_USER, EMAIL_PASS} from '../config/constants.mjs'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: `${EMAIL_USER}`,
        pass: `${EMAIL_PASS}`
    }
});

export const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: `${EMAIL_USER}`,
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error:', error);
        }
        console.log('Email sent:', info.response);
    });
};

