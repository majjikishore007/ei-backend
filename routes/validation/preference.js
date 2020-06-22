const User = require("../../models/user");
const mongoose = require("mongoose");

exports.validateOnPreferenceSave = async (req, res, next) => {
  if (!req.body.category || req.body.category.length == 0) {
    return res.status(400).json({
      success: false,
      message: "Please enter atleast one category in preference",
    });
  }
  try {
    let userExist = await User.findOne({
      _id: mongoose.Types.ObjectId(req.body.user),
    });
    if (!userExist) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter correct user" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error });
  }
};
