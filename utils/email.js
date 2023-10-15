const mailer = require('nodemailer');

exports.sendMail = async (options) => {
  let transport = mailer.createTransport({
    host: process.env.MAIL_TRAP_HOST,
    port: process.env.MAIL_TRAP_PORT,
    secureConnection: false,
    auth: {
      user: process.env.MAIL_TRAP_USERNAME,
      pass: process.env.MAIL_TRAP_PASSWORD
    },
    tls: {
      ciphers: 'SSLv3'
    }
  });

  const mailOptions = {
    from: 'Rama ranngessara',
    to: options.email,
    subject: options.subject,
    text: options.text
  };
  await transport.sendMail(mailOptions);
};
