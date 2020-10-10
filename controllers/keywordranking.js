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
