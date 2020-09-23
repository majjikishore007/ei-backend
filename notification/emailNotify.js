const User = require("../models/user");
const mongoose = require("mongoose");
const maildata = require("../config/mail-data");
const transpoter = require("../config/mail-setup");
var hbs = require("nodemailer-express-handlebars");
transpoter.use(
  "compile",
  hbs({
    viewEngine: {
      extName: ".hbs",
      partialsDir: "./view/",
      layoutsDir: "./view/",
      defaultLayout: "index.hbs",
    },
    viewPath: "./view/",
    extName: ".hbs",
  })
);

exports.sendExpireNotificationMail = async () => {
  let users = await User.find({ expireDate: { $exists: true } }).sort({
    _id: -1,
  });
  for (let i = 0; i <= users.length - 1; i++) {
    /**if user is expiring in 2 days or today */
    let dt = new Date(users[i].expireDate.toString());
    leftDay = Math.round(
      (dt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    if (leftDay == 0 || leftDay == 1 || leftDay == 2) {
      /**it mean user will be xpired in next 2 days or 1 days or today
       * then send them a email to subscribe
       */

      let d = dt.getDate();
      let mn = dt.getMonth() + 1;
      let yr = dt.getFullYear();

      let option = {
        from: maildata.expiryEmail.from,
        to: users[i].email,
        subject: maildata.expiryEmail.subject,
        template: "index",
        context: {
          userName: users[i].displayName,
          expireDate: d + "/" + mn + "/" + yr,
        },
      };
      transpoter.sendMail(option, (er, information) => {
        if (er) {
          console.log(er);
        } else {
          console.log("success");
        }
      });
    }
  }
};

/**call this function from payment successfull callback api route to send email after successfull payment
 * with paid user id
 */
exports.paymentAckMail = async (id) => {
  let user = await User.findOne({ _id: mongoose.Types.ObjectId(id) });

  let d = new Date(user.expireDate.toString()).getDate();
  let mn = new Date(user.expireDate.toString()).getMonth() + 1;
  let yr = new Date(user.expireDate.toString()).getFullYear();
  let option = {
    from: maildata.paymentAcknowledgeEmail.from,
    to: user.email,
    subject: maildata.paymentAcknowledgeEmail.subject,
    template: "index",
    context: {
      userName: user.displayName,
      expireDate: d + "/" + mn + "/" + yr,
    },
  };
  transpoter.sendMail(option, (er, information) => {
    if (er) {
      console.log(er);
    } else {
      console.log("success");
    }
  });
};
