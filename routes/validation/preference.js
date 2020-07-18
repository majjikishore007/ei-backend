const User = require("../../models/user");
const mongoose = require("mongoose");

exports.validateOnPreferenceSave = async (req, res, next) => {
  if (!req.body.keyword) {
    return res.status(400).json({
      success: false,
      message: "Please select keyword to add into preference",
    });
  }
  next();
};
