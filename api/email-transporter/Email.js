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

class EmailService {
    constructor(origin, language) {
        this.origin = origin;
    }

    sendEmailConfirmation(email, verificationLink, token) {
        const link = `${verificationLink}?t=${token}`
        const message = `${i18next.t('You have just registered on motogym.online website. To confirm e-mail, click on the link')} ${link}`;

        this.sendEmail(email, 'Confirm your email address', message);
    }

    sendResetPassword(email, link, token) {
        const linkWithToken = `${link}?t=${token}`;
        const message = `${i18next.t('To reset your password click on the link')} ${linkWithToken}`;

        this.sendEmail(email, 'Password recovery', message);
    };

    sendRejectCompetitionResult(email, competition, message) {
        const messageText = i18next.t('Your result for {{competition}} competition was rejected! Reason for rejection - {{message}}', {competition, message});

        this.sendEmail(email, 'Your result was rejected', messageText)
    };

    sendEmail(to, subject, text) {
        const transporter = nodemailer.createTransport(transportOptions);

        return transporter.sendMail({
            from: 'no-reply@motogym.online',
            to,
            subject: i18next.t(subject),
            text
        });
    }
}

module.exports = {EmailService};
