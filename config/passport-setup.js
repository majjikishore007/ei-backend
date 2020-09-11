const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const LinkedInStrategy = require("passport-linkedin").Strategy;
const User = require("../models/user");
const config = require("./database");
const maildata = require("./mail-data");
const tranpoter = require("./mail-setup");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    (username, password, done) => {
      User.findOne({ email: username }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "user not found" });
        }
        if (!user.comparePassword(password)) {
          return done(null, false, { message: "Password do not matched" });
        }
        return done(null, user);
      });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: config.keys.google.clientID,
      clientSecret: config.keys.google.clientSecret,
      callbackURL: config.keys.google.callbackURL,
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ email: profile._json.email }).then((currentUser) => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          new User({
            displayName: profile.displayName,
            email: profile._json.email,
            thumbnail: profile._json.picture,
            providerId: profile.id,
            password: "aminSecret9As#",
            role: {
              subscriber: true,
              author: false,
              admin: false,
            },
            otp: "",
            email_verified: true,
            date: Date.now(),
          })
            .save()
            .then((newUser) => {
              const mailOption = {
                from: maildata.welcomeMail.form,
                to: newUser.email,
                subject: maildata.welcomeMail.subject,
                template: "index",
              };
              tranpoter.sendMail(mailOption, (er, information) => {
                if (er) {
                  done(
                    er,
                    null,
                    "user created but there is an issue to send your verfication mail"
                  );
                } else {
                  done(null, newUser);
                }
              });
            });
        }
      });
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: config.keys.facebook.clientID,
      clientSecret: config.keys.facebook.clientSecret,
      callbackURL: config.keys.facebook.callbackURL,
      profileFields: ["id", "displayName", "photos", "email"],
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ email: profile.emails[0].value }).then((currentUser) => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          new User({
            displayName: profile.displayName,
            email: profile.emails[0].value,
            thumbnail: profile.photos[0].value,
            providerId: profile.id,
            password: "aminSecretAs#",
            role: {
              subscriber: true,
              author: false,
              admin: false,
            },
            date: Date.now(),
          })
            .save()
            .then((newUser) => {
              const mailOption = {
                from: maildata.welcomeMail.form,
                to: newUser.email,
                subject: maildata.welcomeMail.subject,
                html:
                  "<p> Hello " +
                  newUser.displayName.split(" ")[0] +
                  ",</p>" +
                  maildata.welcomeMail.body,
              };
              tranpoter.sendMail(mailOption, (er, information) => {
                if (er) {
                  done(
                    er,
                    null,
                    "user created but there is an issue to send your verfication mail"
                  );
                } else {
                  done(null, newUser);
                }
              });
            });
        }
      });
    }
  )
);

passport.use(
  new LinkedInStrategy(
    {
      consumerKey: config.keys.linkedin.clientID,
      consumerSecret: config.keys.linkedin.clientSecret,
      callbackURL: config.keys.linkedin.callbackURL,
      profileFields: [
        "id",
        "first-name",
        "last-name",
        "email-address",
        "headline",
      ],
    },
    function (token, tokenSecret, profile, done) {
      return done(profile);
    }
  )
);
