const Article = require("../../models/article");

exports.validateOnSaveArticleTop = async (req, res, next) => {
  if (!req.body.article) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide article Id" });
  }
  let articleExist = await Article.findOne({ _id: req.body.article });
  if (!articleExist) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide correct article Id" });
  }
  next();
};
