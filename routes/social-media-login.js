const User = require("../models/user"); // Import User Model Schema
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const passport = require("passport");
const config = require("../config/database");

//Login with Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/redirect", (req, res) => {
  passport.authenticate("google", (err, profile, info) => {
    if (err) {
      res.json({ success: false, message: err });
    } else {
      const token = jwt.sign({ userId: profile._id }, config.secret, {
        expiresIn: "30d",
      });
      const email_verified = true + "";

      res.redirect(
        "https://extrainsights.in/redirect/" +
          token +
          "/" +
          profile._id +
          "/" +
          email_verified
      );
    }
  })(req, res);
});

//Login with Facebook
router.get(
  "/facebook",
  passport.authenticate("facebook", { authType: "rerequest", scope: ["email"] })
);

router.get("/facebook/redirect", (req, res) => {
  passport.authenticate("facebook", (err, profile, info) => {
    if (err) {
      res.json({ success: false, message: err });
    } else {
      const token = jwt.sign({ userId: profile._id }, config.secret, {
        expiresIn: "30d",
      });
      res.redirect("/redirect/" + token + "/" + profile._id);
    }
  })(req, res);
});

//login with linkedIn
router.get(
  "/linkedin",
  passport.authenticate("linkedin", {
    scope: ["r_basicprofile", "r_emailaddress"],
  })
);

router.get("/linkedin/redirect", (req, res) => {
  passport.authenticate("linkedin", (err, profile, info) => {
    console.log(err);
    res.json(err);
  })(req, res);
});

module.exports = router;
