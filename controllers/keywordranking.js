const RankValue = require("../models/rank_value");
const KeywordRanking = require("../models/keyword_ranking");
const Article = require("../models/article");
const Keyword = require("../models/keyword");

exports.updateKeywordRankForPreferenceSelection = async (req, res, next) => {
  try {
    let { action, keyword } = req.body;
    let rankValue = await RankValue.findOne({ action });

    if (action == "Preference_Selection") {
      let present = await KeywordRanking.findOne({
        user: req.userData.userId,
        keyword,
      });
      if (!present) {
        await new KeywordRanking({
          user: req.userData.userId,
          keyword,
          rank: rankValue.keyword_value,
        }).save();
      } else {
        await KeywordRanking.findOneAndUpdate(
          { user: req.userData.userId, keyword },
          {
            $set: {
              rank: present.rank + rankValue.keyword_value,
            },
          },
          { new: true }
        );
      }
    }
    res
      .status(200)
      .json({ success: true, message: "successfull updated ranking" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.updateKeywordRankForArticleView = async (req, res, next) => {
  try {
    let { action, urlStr } = req.body;
    let rankValue = await RankValue.findOne({ action });

    if (action == "Article_View") {
      let viewedArticle = await Article.findOne({ urlStr });
      if (!viewedArticle) {
        return res
          .status(200)
          .json({ success: false, message: "wrong article" });
      }
      let keywordList = viewedArticle.category.toLowerCase().split(",");
      let keywords = await Keyword.find({ keyword: { $in: keywordList } });

      for (let i = 0; i <= keywords.length - 1; i++) {
        let keyword = keywords[i]._id;
        let present = await KeywordRanking.findOne({
          user: req.userData.userId,
          keyword,
        });
        if (!present) {
          await new KeywordRanking({
            user: req.userData.userId,
            keyword,
            rank: rankValue.keyword_value,
          }).save();
        } else {
          await KeywordRanking.findOneAndUpdate(
            { user: req.userData.userId, keyword },
            {
              $set: {
                rank: present.rank + rankValue.keyword_value,
              },
            },
            { new: true }
          );
        }
      }

      /**find keywords for publisher of this article and update ranking for those */
    }
    res
      .status(200)
      .json({ success: true, message: "successfull updated ranking" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

/**testing pending */
exports.updateKeywordRankForArticleRead = async (req, res, next) => {
  try {
    let { action, urlStr } = req.body;
    let rankValue = await RankValue.findOne({ action });

    if (action == "Read_Article") {
      let readArticle = await Article.findOne({ urlStr });
      if (!readArticle) {
        return res
          .status(200)
          .json({ success: false, message: "wrong article" });
      }
      let keywordList = viewedArticle.category.toLowerCase().split(",");
      let keywords = await Keyword.find({ keyword: { $in: keywordList } });

      for (let i = 0; i <= keywords.length - 1; i++) {
        let keyword = keywords[i]._id;
        let present = await KeywordRanking.findOne({
          user: req.userData.userId,
          keyword,
        });
        if (!present) {
          await new KeywordRanking({
            user: req.userData.userId,
            keyword,
            rank: rankValue.keyword_value,
          }).save();
        } else {
          await KeywordRanking.findOneAndUpdate(
            { user: req.userData.userId, keyword },
            {
              $set: {
                rank: present.rank + rankValue.keyword_value,
              },
            },
            { new: true }
          );
        }
      }

      /**find keywords for publisher of this article and update ranking for those */
    }
    res
      .status(200)
      .json({ success: true, message: "successfull updated ranking" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

exports.updateKeywordRankForPublisherVote = async (req, res, next) => {
  try {
    let { action, publisher } = req.body;
    let rankValue = await RankValue.findOne({ action });

    if (action == "Vote_for_Publisher") {
      let fetchedArticles = await Article.find({ publisher });
      if (!fetchedArticles) {
        return res
          .status(200)
          .json({ success: false, message: "articles not found" });
      }
      let keywordList =new Set();
      for(let i = 0; i<= fetchedArticles.length - 1; i++){
        let list = fetchedArticles[i].category.toLowerCase().split(",");
        for(let j = 0; j<= list.length - 1; j++){
          keywordList.add(list[j]);
        }
      }
      let keyList = Array.from(keywordList);
      let keywords = await Keyword.find({ keyword: { $in: keyList } });

      for (let i = 0; i <= keywords.length - 1; i++) {
        let keyword = keywords[i]._id;
        let present = await KeywordRanking.findOne({
          user: req.userData.userId,
          keyword,
        });
        if (!present) {
          await new KeywordRanking({
            user: req.userData.userId,
            keyword,
            rank: rankValue.keyword_value,
          }).save();
        } else {
          await KeywordRanking.findOneAndUpdate(
            { user: req.userData.userId, keyword },
            {
              $set: {
                rank: present.rank + rankValue.keyword_value,
              },
            },
            { new: true }
          );
        }
      }

      /**find keywords for publisher of this article and update ranking for those */
    }
    res
      .status(200)
      .json({ success: true, message: "successfull updated ranking" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

exports.updateKeywordRankForCommentOnArticle = async (req, res, next) => {
  try {
    let { action, urlStr } = req.body;
    let rankValue = await RankValue.findOne({ action });

    if (action == "Comment_on_Article") {
      let commentedArticle = await Article.findOne({ urlStr });
      if (!commentedArticle) {
        return res
          .status(200)
          .json({ success: false, message: "wrong article" });
      }
      let keywordList = commentedArticle.category.toLowerCase().split(",");
      let keywords = await Keyword.find({ keyword: { $in: keywordList } });

      for (let i = 0; i <= keywords.length - 1; i++) {
        let keyword = keywords[i]._id;
        let present = await KeywordRanking.findOne({
          user: req.userData.userId,
          keyword,
        });
        if (!present) {
          await new KeywordRanking({
            user: req.userData.userId,
            keyword,
            rank: rankValue.keyword_value,
          }).save();
        } else {
          await KeywordRanking.findOneAndUpdate(
            { user: req.userData.userId, keyword },
            {
              $set: {
                rank: present.rank + rankValue.keyword_value,
              },
            },
            { new: true }
          );
        }
      }

      /**find keywords for publisher of this article and update ranking for those */
    }
    res
      .status(200)
      .json({ success: true, message: "successfull updated ranking" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

exports.updateKeywordRankForRateArticle = async (req, res, next) => {
  try {
    let { action, urlStr } = req.body;
    let rankValue = await RankValue.findOne({ action });

    if (action == "Rate_Article") {
      let rateArticle = await Article.findOne({ urlStr });
      if (!rateArticle) {
        return res
          .status(200)
          .json({ success: false, message: "wrong article" });
      }
      let keywordList = rateArticle.category.toLowerCase().split(",");
      let keywords = await Keyword.find({ keyword: { $in: keywordList } });

      for (let i = 0; i <= keywords.length - 1; i++) {
        let keyword = keywords[i]._id;
        let present = await KeywordRanking.findOne({
          user: req.userData.userId,
          keyword,
        });
        if (!present) {
          await new KeywordRanking({
            user: req.userData.userId,
            keyword,
            rank: rankValue.keyword_value,
          }).save();
        } else {
          await KeywordRanking.findOneAndUpdate(
            { user: req.userData.userId, keyword },
            {
              $set: {
                rank: present.rank + rankValue.keyword_value,
              },
            },
            { new: true }
          );
        }
      }

      /**find keywords for publisher of this article and update ranking for those */
    }
    res
      .status(200)
      .json({ success: true, message: "successfull updated ranking" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

exports.updateKeywordRankForShareArticle = async (req, res, next) => {
  try {
    let { action, urlStr } = req.body;
    let rankValue = await RankValue.findOne({ action });

    if (action == "Share_Article") {
      let shareArticle = await Article.findOne({ urlStr });
      if (!shareArticle) {
        return res
          .status(200)
          .json({ success: false, message: "wrong article" });
      }
      let keywordList = shareArticle.category.toLowerCase().split(",");
      let keywords = await Keyword.find({ keyword: { $in: keywordList } });

      for (let i = 0; i <= keywords.length - 1; i++) {
        let keyword = keywords[i]._id;
        let present = await KeywordRanking.findOne({
          user: req.userData.userId,
          keyword,
        });
        if (!present) {
          await new KeywordRanking({
            user: req.userData.userId,
            keyword,
            rank: rankValue.keyword_value,
          }).save();
        } else {
          await KeywordRanking.findOneAndUpdate(
            { user: req.userData.userId, keyword },
            {
              $set: {
                rank: present.rank + rankValue.keyword_value,
              },
            },
            { new: true }
          );
        }
      }

      /**find keywords for publisher of this article and update ranking for those */
    }
    res
      .status(200)
      .json({ success: true, message: "successfull updated ranking" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

exports.updateKeywordRankForBookmarkArticle = async (req, res, next) => {
  try {
    let { action, urlStr } = req.body;
    let rankValue = await RankValue.findOne({ action });

    if (action == "Bookmark_Article") {
      let bookmarkArticle = await Article.findOne({ urlStr });
      if (!bookmarkArticle) {
        return res
          .status(200)
          .json({ success: false, message: "wrong article" });
      }
      let keywordList = bookmarkArticle.category.toLowerCase().split(",");
      let keywords = await Keyword.find({ keyword: { $in: keywordList } });

      for (let i = 0; i <= keywords.length - 1; i++) {
        let keyword = keywords[i]._id;
        let present = await KeywordRanking.findOne({
          user: req.userData.userId,
          keyword,
        });
        if (!present) {
          await new KeywordRanking({
            user: req.userData.userId,
            keyword,
            rank: rankValue.keyword_value,
          }).save();
        } else {
          await KeywordRanking.findOneAndUpdate(
            { user: req.userData.userId, keyword },
            {
              $set: {
                rank: present.rank + rankValue.keyword_value,
              },
            },
            { new: true }
          );
        }
      }

      /**find keywords for publisher of this article and update ranking for those */
    }
    res
      .status(200)
      .json({ success: true, message: "successfull updated ranking" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

exports.updateKeywordRankForExitArticleWithoutClicking = async (req, res, next) => {
  try {
    let { action, urlStr } = req.body;
    let rankValue = await RankValue.findOne({ action });

    if (action == "Exit_article_W/o_Clicking") {
      let nonClickedArticle = await Article.findOne({ urlStr });
      if (!nonClickedArticle) {
        return res
          .status(200)
          .json({ success: false, message: "wrong article" });
      }
      let keywordList = nonClickedArticle.category.toLowerCase().split(",");
      let keywords = await Keyword.find({ keyword: { $in: keywordList } });

      for (let i = 0; i <= keywords.length - 1; i++) {
        let keyword = keywords[i]._id;
        let present = await KeywordRanking.findOne({
          user: req.userData.userId,
          keyword,
        });
        if (!present) {
          await new KeywordRanking({
            user: req.userData.userId,
            keyword,
            rank: rankValue.keyword_value,
          }).save();
        } else {
          await KeywordRanking.findOneAndUpdate(
            { user: req.userData.userId, keyword },
            {
              $set: {
                rank: present.rank + rankValue.keyword_value,
              },
            },
            { new: true }
          );
        }
      }

      /**find keywords for publisher of this article and update ranking for those */
    }
    res
      .status(200)
      .json({ success: true, message: "successfull updated ranking" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};