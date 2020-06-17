const Article = require("../../models/article");
const User = require("../../models/user");

exports.validateOnSaveOfArticleView = async (req, res, next) => {
  if (!req.body.viewedAt) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter View at" });
  }
  if (!req.body.news) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter article Id" });
  }
  if (!req.body.user) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter user" });
  }
  let articleExist = await Article.findOne({ _id: req.body.news });
  if (!articleExist) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter correct Article" });
  }
  let userExist = await User.findOne({ _id: req.body.user });
  if (!userExist) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter correct user" });
  }
  next();
};
