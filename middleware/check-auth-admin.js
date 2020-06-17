const jwt = require("jsonwebtoken");
const keys = require("../config/database");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, keys.secret);
    req.userData = decoded;
    let user = await User.findOne({ _id: decoded.userId });
    if (user.role.admin == false) {
      return res.json({ success: false, error: "Auth failed" });
    }
    next();
  } catch (error) {
    return res.json({ success: false, error: "Auth failed" });
  }
};
