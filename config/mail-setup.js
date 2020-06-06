const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
var transporter = nodemailer.createTransport({
    host: 'smtp.zoho.in',
    port: 465,
    secure: true,
    auth: {
      user: 'info@extrainsights.in',
      pass: 'qckzsqethLPR'
    }
  });
  transporter.use('compile', hbs({
    viewEngine: {
        extName: '.hbs',
        partialsDir: './template/',
        layoutsDir: './template/',
        defaultLayout: 'index.hbs',
      },
      viewPath: './template/',
      extName: '.hbs',
}));

module.exports = transporter;