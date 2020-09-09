const User = require("../models/user");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const config = require("../config/database");
const maildata = require("../config/mail-data");
const transpoter = require("../config/mail-setup");
var hbs = require('nodemailer-express-handlebars');
transpoter.use('compile', hbs({
  viewEngine: {
      extName: '.hbs',
      partialsDir: './view/',
      layoutsDir: './view/',
      defaultLayout: 'index.hbs',
    },
    viewPath: './view/',
    extName: '.hbs',
}));
exports.registerUser = async (req, res, next) => {
  try {
    let otp = Math.floor(100000 + Math.random() * 900000) + "";
    /*Create new user object and apply user input*/
    let user = new User({
      email: req.body.email.toLowerCase(),
      displayName: req.body.displayName,
      password: req.body.password,
      thumbnail:
        "https://storage.googleapis.com/extra-insights-images/user.png",
      role: { subscriber: true, author: false, admin: false },
      phone: req.body.phone,
      refcode: req.body.refcode,
      phone_verified: false,
      otp,
      email_verified: false,
      date: Date.now(),
    });
    // Save user to database
    user.save((err) => {
      // Check if error occured
      if (err) {
        // Check if error is an error indicating duplicate accounts
        if (err.code === 11000) {
          res.json({ success: false, message: "E-mail already exists" }); // Return error
        } else {
          // Check if error is a validation rror
          if (err.errors) {
            // Check if validation error is in the email field
            if (err.errors.email) {
              res.json({ success: false, message: err.errors.email.message }); // Return error
            } else {
              // Check if validation error is in the username field
              if (err.errors.displayName) {
                res.json({
                  success: false,
                  message: err.errors.displayName.message,
                }); // Return error
              } else {
                // Check if validation error is in the password field
                if (err.errors.password) {
                  res.json({
                    success: false,
                    message: err.errors.password.message,
                  }); // Return error
                } else {
                  res.json({ success: false, message: err }); // Return any other error not already covered
                }
              }
            }
          } else {
            res.json({
              success: false,
              message: "Could not save user. Error: ",
              err,
            }); // Return error if not related to validation
          }
        }
      } else {
        const mailOption = {
          from: maildata.welcomeMail.form,
          to: req.body.email,
          subject: maildata.welcomeMail.subject,
          text: "<p> Hello " +
          req.body.displayName.split(" ")[0] +
          ","+ maildata.welcomeMail.title + "</p>",
          template: 'index'
           
        };

        const emailVerify = {
          from: maildata.emailVerifyMail.form,
          to: req.body.email,
          subject: maildata.emailVerifyMail.subject,
          html:
            "<p> Hello " +
            req.body.displayName.split(" ")[0] +
            ",</p>" +
            maildata.emailVerifyMail.upperBody +
            "<p>Your OTP is " +
            otp +
            "</p>" +
            "<p> Link: <a href='https://extrainsights.in/verify-email' target='_blank'>https://extrainsights.in/verify-email</a></p>" +
            maildata.emailVerifyMail.lowerBody,
        };

        [mailOption, emailVerify].map((option) => {
          transpoter.sendMail(option, (er, information) => {
            if (er) {
               console.log(er);
            } else {
              console.log("success");
            }
          });
        });

        res.status(201).json({
          success: true,
          message: "Acount registered! Check email for verification code",
        });

        // Return success
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};


exports.loginUser = async (req, res) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      res.json({ success: false, message: err });
    } else if (!user) {
      res.json({ success: false, message: info.message });
    } else {
      const token = jwt.sign({ userId: user._id }, config.secret, {
        expiresIn: "30d",
      });

      res.status(200).json({ success: true, token: token, user: user._id  , expires : user.expireDate });
    }
  })(req, res);
};

exports.loginAsGuestUser = async (req, res, next) => {
  if (!req.body.email) {
    res.json({ success: false, message: "You must provide an e-mail" }); // Return error
  } else {
    // Create new user object and apply user input
    let user = new User({
      email: req.body.email.toLowerCase(),
      displayName: "Guest User",
      password: "AminSecret97Az#",
      thumbnail:
        "https://storage.googleapis.com/extra-insights-images/user.png",
      role: { subscriber: false, author: false, admin: false },
      date: Date.now(),
    });
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          res.json({ success: false, message: "E-mail already exists" });
        } else {
          if (err.errors) {
            if (err.errors.email) {
              res.json({ success: false, message: err.errors.email.message });
            } else {
              res.json({ success: false, message: err });
            }
          } else {
            res.json({
              success: false,
              message: "Could not save user. Error: ",
              err,
            });
          }
        }
      } else {
        const mailOption = {
          from: maildata.welcomeMail.form,
          to: req.body.email,
          subject: maildata.welcomeMail.subject,
          html:
            "<p> Hello " + req.body.email + ",</p>" + maildata.welcomeMail.body,
        };
        transpoter.sendMail(mailOption, (er, information) => {
          if (er) {
            res.status(200).json({
              success: true,
              message:
                "Acount registered!, But There is an issue to verfiy you right now",
            });
          } else {
            User.findOne({ email: req.body.email })
              .exec()
              .then((result) => {
                const token = jwt.sign({ userId: result._id }, config.secret, {
                  expiresIn: "1h",
                });
                res
                  .status(200)
                  .json({ success: true, token: token, user: result._id });
              });
          }
        });
      }
    });
  }
};

exports.mobileGoogleLogin = async (req, res, next) => {
  try {
    if (!req.body.email) {
      res.json({ success: false, message: "You must provide an e-mail" });
    } else {
      User.findOne({ email: req.body.email })
        .exec()
        .then((result) => {
          if (result) {
            const token = jwt.sign({ userId: result._id }, config.secret, {
              expiresIn: "30d",
            });
            res.json({ success: true, token: token, user: result._id });
          } else {
            let user = new User({
              email: req.body.email.toLowerCase(),
              displayName: req.body.displayName,
              password: "AminSecret97Az#",
              thumbnail: req.body.thumbnail,
              role: { subscriber: true, author: false, admin: false },
              date: Date.now(),
            });
            user.save().then((data) => {
              const token = jwt.sign({ userId: data._id }, config.secret, {
                expiresIn: "30d",
              });
              res.json({ success: true, token: token, user: data._id });
            });
          }
        });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    let otp = req.params.otp;
    let email = req.params.email;
    let user = await User.findOne({ otp, email });
    if (!user) {
      return res.status(400).json({ success: false, message: "wrong otp" });
    }
    await User.findOneAndUpdate(
      { otp, email },
      {
        $set: {
          email_verified: true,
          otp: "",
        },
      }
    );
    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.resendOtpInEmail = async (req, res, next) => {
  try {
    let otp = Math.floor(100000 + Math.random() * 900000) + "";
    let email = req.params.email;
    let user = await User.findOne({ email, email_verified: false });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Your Account is already verified" });
    }
    await User.findOneAndUpdate({ email }, { $set: { otp } });
    const emailVerify = {
      from: maildata.emailVerifyMail.form,
      to: req.params.email,
      subject: maildata.emailVerifyMail.subject,
      html:
        "<p> Hello " +
        user.displayName.split(" ")[0] +
        ",</p>" +
        maildata.emailVerifyMail.upperBody +
        "<p>Your OTP is " +
        otp +
        "</p>" +
        "<p> Link: <a href='https://extrainsights.in/verify-email' target='_blank'>https://extrainsights.in/verify-email</a></p>" +
        maildata.emailVerifyMail.lowerBody,
    };
    transpoter.sendMail(emailVerify, (er, information) => {
      if (er) {
        res.status(400).json({
          success: false,
          message: "There is an issue to verfiy you right now",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Check email for verification code",
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};
