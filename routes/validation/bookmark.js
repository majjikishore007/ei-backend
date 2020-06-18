const Article = require("../../models/article");
const mongoose = require("mongoose");
exports.validationOnAddbookmark = async (req, res, next) => {
  if (!req.body.articleId) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter article Id" });
  }
  let isArticleExist = await Article.findOne({
    _id: mongoose.Types.ObjectId(req.body.articleId),
  });
  if (!isArticleExist) {
    return res
      .status(400)
      .json({ success: false, message: "Please select correct article Id" });
  }
  next();
};
