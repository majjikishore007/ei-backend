const transporter = require("../config/mail-setup");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const maildata = require("../config/mail-data");

exports.getloggedInUserInfo = async (req, res, next) => {
  try {
    let result = await User.findById(req.userData.userId);
    res.status(200).json({ success: true, user: result });
  } catch (error) {
    res.status(500).json({ success: false, error:error });
  }
};

exports.updateUserInfo = async (req, res, next) => {
  try {
    await User.update({ _id: req.userData.userId }, { $set: req.body });
    res.status(200).json({ success: true, message: "User details updated" });
  } catch (error) {
    res.status(500).json({  success: false, error:error });
  }
};
exports.resetPasswordMail = async (req, res, next) => {
  try {
    const token = req.body.email.split("@")[0] + Date.now();
    let result = await User.findOneAndUpdate(
      { email: req.body.email },
      { $set: { token: token } }
    );
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
    const mailOption = {
      from: maildata.resetMail.form,
      to: result.email,
      subject: maildata.resetMail.subject,
      html:
        "<p>Hello " +
        result.displayName +
        "</p>" +
        maildata.resetMail.body[0] +
        "<p><a href='https://extrainsights.in/recovery/" +
        req.body.email +
        "/" +
        token +
        "'>Reset Passowrd Link</a></p>" +
        maildata.resetMail.body[1] +
        "<p><a href='https://extrainsights.in/recovery/" +
        req.body.email +
        "/" +
        token +
        "'>https://extrainsights.in/recovery/" +
        req.body.email +
        "/" +
        token +
        "</a></p>" +
        maildata.resetMail.body[2],
    };
    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        return res.status(500).json(error);
      }
      return res.status(200).json({ success: true, message: "mail sent" });
    });
  } catch (error) {
    res.status(500).json({ success: false, error:error });
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    let users = await User.find().sort("-_id").select("displayName email");
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({  success: false, error:error });
  }
};

exports.logoutUser = async (req, res, next) => {
  try {
    req.logout();
    res.status(200).json({ success: true, message: "logout successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error:error });
  }
};

exports.getUserCount = async (req, res, next) => {
  try {
    let countUser = await User.countDocuments({});
    res.status(200).json({ success: true, data: countUser });
  } catch (error) {
    res.status(500).json({  success: false, error:error});
  }
};

exports.getUserToken = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, user: req.userData });
  } catch (error) {
    res.status(500).json({ success: false, error:error });
  }
};

exports.checkEmailExist = async (req, res, next) => {
  try {
    const email = req.params.email;
    let result = await User.countDocuments({ email: email });
    if (result > 0) {
      res.status(200).json({ success: true });
    } else {
      res.status(200).json({ success: false });
    }
  } catch (error) {
    res.status(500).json({  success: false, error:error });
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        res.status(500).json({ success: false, error: "Hasing error" });
      } else {
        const data = {
          displayName: req.body.displayName,
          phone: req.body.phone,
          password: hash,
          role: { subscriber: true, author: false, admin: false },
        };
        await User.updateOne({ token: req.body.token }, { $set: data });

        res
          .status(200)
          .json({ success: true, message: "Password has been chnaged" });
      }
    });
  } catch (error) {
    res.status(500).json({  success: false, error:error });
  }
};
