const BookMark = require("../models/bookmark");
const Publisher = require("../models/publisher");

exports.addBookmark = async (req, res, next) => {
  try {
    const bookmark = new BookMark({
      user: req.userData.userId,
      article: req.body.articleId,
      paid: req.body.paid,
      date: Date.now(),
    });
    await bookmark.save();
    res.status(201).json({ success: true, message: "Bookmark saved" });
  } catch (err) {
    if (err.code === 11000) {
      res.status(500).json({
        success: false,
        message: "Bookmarked alreday saved",
      });
    } else {
      res.status(500).json({ success: true, message: err.errmsg });
    }
  }
};

exports.getBookmarks = async (req, res, next) => {
  try {
    BookMark.find({ user: req.userData.userId })
      .populate("article")
      .exec((err, publisher) => {
        Publisher.populate(publisher, {
          path: "article.publisher",
        }).then((bookmarks) => {
          res.status(200).json({ success: true, data: bookmarks });
        });
      });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getBookmarkById = async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    let bookmark = await BookMark.findOne({
      article: articleId,
      user: req.userData.userId,
    });
    res.status(200).json({ success: true, data: bookmark });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.deleteBookmarkById = async (req, res, next) => {
  try {
    const id = req.params.articleId;
    await BookMark.deleteOne({
      $and: [{ user: req.userData.userId, article: id }],
    });
    res.status(200).json({ success: true, message: "deleted" });
  } catch (error) {
    res.status(500).json({ error });
  }
};
