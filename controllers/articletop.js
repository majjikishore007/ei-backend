const ArticleTop = require("../models/article-top");
const Publisher = require("../models/publisher");

exports.getAllArticleTop = async (req, res, next) => {
  try {
    let articleTops = await ArticleTop.find()
      .sort({ _id: -1 })
      .populate("article");
    res.status(200).json({ success: true, data: articleTops });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getAllArticleTopForMobile = async (req, res, next) => {
  try {
    ArticleTop.find()
      .sort("-_id")
      .populate("article")
      .exec((err, publisher) => {
        Publisher.populate(publisher, {
          path: "article.publisher",
        }).then((docs) => {
          const response = {
            count: docs.length,
            articles: docs.map((doc) => {
              return {
                title: doc.article.title,
                description: doc.article.description,
                price: doc.article.price,
                author: doc.article.author,
                cover: doc.article.cover,
                publisher: doc.article.publisher,
                website: doc.article.website,
                category: doc.article.category,
                time: doc.article.time,
                date: doc.article.publishingDate,
                id: doc.article.id,
                lan: doc.article.lan,
                urlStr: doc.article.urlStr,
              };
            }),
          };
          res.json({ success: true, data: response.articles });
        });
      });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.saveArticleTop = async (req, res, next) => {
  try {
    const articleTop = new ArticleTop({
      article: req.body.article,
    });
    let insertedArticleTop = await articleTop.save();
    res.status(201).json({
      success: true,
      message: "articleTop has been submitted",
      data: insertedArticleTop,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.deleteArticleTopWithId = async (req, res, next) => {
  try {
    const id = req.params.articletopId;
    await ArticleTop.remove({ _id: id });
    res.status(200).json({ success: true, message: "ArticleTop Deleted!" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
