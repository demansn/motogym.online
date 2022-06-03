const nodemailer = require('nodemailer');
const {i18next} = require('../localization');

const transportOptions = {
    host: "mail.adm.tools",
    port: 2525,
    secure: false,
    auth: {
        user: process.env.TRANSPORT_AUTH_USER,
        pass: process.env.TRANSPORT_AUTH_PASS,
    }
};

const sendEmailConfirmation = (email, link) => {
    const transporter = nodemailer.createTransport(transportOptions);

    return transporter.sendMail({
        from: 'no-reply@motogym.online',
        to: email,
        subject: i18next.t('Confirm your email address'),
        text: `${i18next.t('You have just registered on motogym.online website. To confirm e-mail, click on the link')} ${link}`
    });
};

const sendResetPassword = (email, link) => {
    const transporter = nodemailer.createTransport(transportOptions);

    return transporter.sendMail({
        from: 'no-reply@motogym.online',
        to: email,
        subject: i18next.t('Password recovery'),
        text: `${i18next.t('To reset your password click on the link')} ${link}`
    });
};

const sendRejectCompetitionResult = (email, competition, message) => {
    const transporter = nodemailer.createTransport(transportOptions);
    const text = i18next.t('Your result for {{competition}} competition was rejected! Reason for rejection - {{message}}', {competition, message});

    return transporter.sendMail({
        from: 'no-reply@motogym.online',
        to: email,
        subject: i18next.t('Your result was rejected'),
        text: text
    });
};


module.exports = {
    sendResetPassword,
    sendEmailConfirmation,
    sendRejectCompetitionResult
};