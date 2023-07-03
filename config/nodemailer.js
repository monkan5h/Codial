const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const env = require("./environment");

let transporter = nodemailer.createTransport(env.smtp);

//we will use this function to render template
let renderTemplate = (data, relativePath) => {
  let mailHTML;

  ejs.renderFile(path.join(__dirname, "../views/mailer", relativePath));
  data,
    function (error, template) {
      if (error) {
        return console.log("Error in rendering template");
      }
      mailHTML = template;
    };
  return mailHTML;
};

module.exports = {
  transporter,
  renderTemplate,
};
