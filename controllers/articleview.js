const Viewarticle = require("../models/articleview");
const mongoose = require("mongoose");

exports.getAllArticleViews = async (req, res, next) => {
  try {
    let viewArticles = await Viewarticle.find()
      .sort({ _id: -1 })
      .populate("news")
      .populate("user");
    res.status(200).json({ success: true, data: viewArticles });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getArticleViewByArticleId = async (req, res, next) => {
  try {
    let viewArticles = await Viewarticle.find({
      news: mongoose.Types.ObjectId(req.params.articleId),
    })
      .sort({ _id: -1 })
      .populate("news", "title")
      .populate("user", "displayName");

    res.status(200).json({ success: true, data: viewArticles });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getArticleViewByUserId = async (req, res, next) => {
  try {
    const id = req.params.userId;
    let viewArticles = await Viewarticle.find({
      user: {
        _id: id,
      },
    })
      .sort({ _id: -1 })
      .populate("news")
      .populate("user");

    res.status(200).json({ success: true, data: viewArticles });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.saveArticleView = async (req, res, next) => {
  try {
    const view = new Viewarticle({
      viewedAt: req.body.viewedAt,
      news: req.body.news,
      user: req.body.user,
    });
    let viewArticle = await Viewarticle.findOne({
      news: { _id: req.body.news },
    });

    if (!viewArticle) {
      let addedViewArticle = await view.save();
      res.status(200).json({ success: true, data: addedViewArticle });
    } else {
      console.log("the article you clicked exists!!");
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
