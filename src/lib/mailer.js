const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "6f5fddec6588b0",
      pass: "ffd2a528c4c210"
    }
  });

