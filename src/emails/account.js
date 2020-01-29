const sgMail = require('@sendgrid/mail');

const apiKey = process.env.sendGrid_API_KEY;

sgMail.setApiKey(apiKey);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
      to: email,
      from: 'admin.email@hotmail.com',
      subject: 'Thanks for joining in!',
      text: `Welcome to App, ${name}`
  });
};

const sendByeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'admin.email@hotmail.com',
        subject: 'Your Account has been removed!',
        text: `See ya`
    });
};

module.exports = {
    sendWelcomeEmail,
    sendByeEmail
};
