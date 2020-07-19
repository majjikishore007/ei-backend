const User = require("../models/user");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const config = require("../config/database");
const maildata = require("../config/mail-data");
const transpoter = require("../config/mail-setup");

exports.registerUser = async (req, res, next) => {
  try {
    /*Create new user object and apply user input*/
    let user = new User({
      email: req.body.email.toLowerCase(),
      displayName: req.body.displayName,
      password: req.body.password,
      thumbnail:
        "https://storage.googleapis.com/extra-insights-images/user.png",
      role: { subscriber: true, author: false, admin: false },
      phone: req.body.pbone,
      phone_verified: false,
      date: Date.now(),
    });
    // Save user to database
    user.save((err) => {
      // Check if error occured
      if (err) {
        // Check if error is an error indicating duplicate accounts
        if (err.code === 11000) {
          res
            .status(409)
            .json({ success: false, message: "E-mail already exists" }); // Return error
        } else {
          // Check if error is a validation rror
          if (err.errors) {
            // Check if validation error is in the email field
            if (err.errors.email) {
              res
                .status(400)
                .json({ success: false, message: err.errors.email.message }); // Return error
            } else {
              // Check if validation error is in the username field
              if (err.errors.displayName) {
                res.status(400).json({
                  success: false,
                  message: err.errors.displayName.message,
                }); // Return error
              } else {
                // Check if validation error is in the password field
                if (err.errors.password) {
                  res.status(400).json({
                    success: false,
                    message: err.errors.password.message,
                  }); // Return error
                } else {
                  res.status(400).json({ success: false, message: err }); // Return any other error not already covered
                }
              }
            }
          } else {
            res.status(400).json({
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
          html:
            "<p> Hello " +
            req.body.displayName.split(" ")[0] +
            ",</p>" +
            maildata.welcomeMail.body,
        };
        transpoter.sendMail(mailOption, (er, information) => {
          if (er) {
            res.status(201).json({
              success: true,
              message:
                "Acount registered!, But There is an issue to verfiy you right now",
            });
          } else {
            res
              .status(201)
              .json({ success: true, message: "Acount registered!" });
          }
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
      res.status(400).json({ success: false, message: err });
    } else if (!user) {
      res.status(400).json({ success: false, message: info.message });
    } else {
      const token = jwt.sign({ userId: user._id }, config.secret, {
        expiresIn: "30d",
      });

      res.status(200).json({ success: true, token: token, user: user._id });
    }
  })(req, res);
};

exports.loginAsGuestUser = async (req, res, next) => {
  if (!req.body.email) {
    res
      .status(400)
      .json({ success: false, message: "You must provide an e-mail" }); // Return error
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
          res
            .status(409)
            .json({ success: false, message: "E-mail already exists" });
        } else {
          if (err.errors) {
            if (err.errors.email) {
              res
                .status(400)
                .json({ success: false, message: err.errors.email.message });
            } else {
              res.status(400).json({ success: false, message: err });
            }
          } else {
            res.status(400).json({
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
