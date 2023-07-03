const nodemailer = require("../config/nodemailer");
const postTemplate = require("./templates/new_post").postTemplate;
exports.newPosts = (post) => {
  nodemailer.transporter.sendMail(
    {
      from: "ansh1996ansh@gmail.com",
      to: post.user.email,
      subject: "New Post Published ...",
      html: postTemplate(post),
    },
    (error, info) => {
      if (error) return console.log(error);
      // console.log("Mail Sent ", info);
      console.log(`Mail Sent to ${info.accepted}`);
    }
  );
};
