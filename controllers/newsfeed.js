const Preference = require("../models/preference");
const Article = require("../models/article");
const Keyword = require("../models/keyword");
const mongoose = require("mongoose");

exports.getArticlesWithLimitedPreferencesAndLimitedKeywords = async (
  req,
  res,
  next
) => {
  try {
    let userId = req.userData.userId;

    let preferencePage = parseInt(req.params.preferencePage);
    let preferenceLimit = parseInt(req.params.preferenceLimit);

    let keywordPage = parseInt(req.params.keywordPage);
    let keywordLimit = parseInt(req.params.keywordLimit);

    let articleLimit = parseInt(req.params.articleLimit);

    /**get preference list for loggedin user */
    let preferences = await Preference.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      { $sort: { _id: -1 } },
      { $skip: preferencePage * preferenceLimit },
      { $limit: preferenceLimit },
      {
        $lookup: {
          from: Keyword.collection.name,
          localField: "keyword",
          foreignField: "_id",
          as: "keywordData",
        },
      },
      { $unwind: "$keywordData" },
      {
        $project: {
          // _id: "$keywordData._id",
          count: "$keywordData.count",
          keyword: "$keywordData.keyword",
        },
      },
    ]);

    /**get top counter keyword list */
    let keywords = await Keyword.aggregate([
      { $match: {} },
      { $sort: { count: -1 } },
      { $skip: keywordPage * keywordLimit },
      { $limit: keywordLimit },
      {
        $project: {
          keyword: 1,
          count: 1,
        },
      },
    ]);

    /**get lastPreferenceId */
    let lastPreferenceId;
    if (preferences.length > 0) {
      lastPreferenceId = preferences[preferences.length - 1]._id;
    } else {
      lastPreferenceId = null;
    }

    /**add preferences and keyword array and remove duplicates */

    let finalKeywordList = [...preferences, ...keywords].filter(
      (v, i, a) => a.findIndex((t) => t.keyword === v.keyword) === i
    );
    /**get that array shuffled */
    finalKeywordList = await shuffleArray(finalKeywordList);

    /**get articles with promise */
    let prm = [];
    let finalKeywordListLen = finalKeywordList.length;
    for (let i = 0; i < finalKeywordListLen; i++) {
      let articlePrm = Article.find({
        category: new RegExp(finalKeywordList[i].keyword, "i"),
      })
        .sort({ _id: -1 })
        .limit(articleLimit + 1)
        .populate("publisher");

      prm.push(articlePrm);
    }

    /**create final list with lastArticleId after promise resolution with shuffled articles */
    let finalListWithArticles = [];
    let articlesPromisesResponse = await Promise.all(prm);
    for (let i = 0; i < finalKeywordListLen; i++) {
      let articles = [];
      if (articlesPromisesResponse[i].length == articleLimit + 1) {
        articles = await cutLastItem(articlesPromisesResponse[i]);
      } else {
        articles = await shuffleArray(articlesPromisesResponse[i]);
      }

      articles = await getRestructuredArticles(articles);

      finalListWithArticles.push({
        keywordData: finalKeywordList[i],
        articles,
      });
    }

    /**create response object with list, lastPreferenceId and lastKeywordId */
    let data = {
      finalListWithArticles,
      lastPreferenceId,
    };
    /**response back to frontend with response object */
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

exports.getNextArticles = async (req, res, next) => {
  try {
    let keyword = req.params.keyword;
    let articlePage = parseInt(req.params.articlePage);
    let articleLimit = parseInt(req.params.articleLimit);

    let articles = await Article.find({
      category: new RegExp(keyword, "i"),
    })
      .sort({ _id: -1 })
      .skip(articlePage * articleLimit)
      .limit(articleLimit + 1)
      .populate("publisher");

    if (articles.length == articleLimit + 1) {
      //to not suffle last item
      articles = await cutLastItem(articles);
    } else {
      articles = await shuffleArray(articles);
    }

    articles = await getRestructuredArticles(articles);
    let data = {
      keyword,
      articles,
    };
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getKeywordsWithArticles = async (req, res, next) => {
  try {
    let keywordPage = parseInt(req.params.keywordPage);
    let keywordLimit = parseInt(req.params.keywordLimit);
    let articleLimit = parseInt(req.params.articleLimit);

    let keywords = await Keyword.aggregate([
      { $match: {} },
      { $sort: { count: -1 } },
      { $skip: keywordPage * keywordLimit },
      { $limit: keywordLimit },
      {
        $project: {
          keyword: 1,
          count: 1,
        },
      },
    ]);

    keywords = await shuffleArray(keywords);

    let prm = [];
    let lenKeywords = keywords.length;
    for (let i = 0; i < lenKeywords; i++) {
      let articlePrm = Article.find({
        category: new RegExp(keywords[i].keyword, "i"),
      })
        .sort({ _id: -1 })
        .limit(articleLimit + 1)
        .populate("publisher");
      prm.push(articlePrm);
    }
    /**after promise resolution */
    let finalListWithArticles = [];
    let articlePromiseResponse = await Promise.all(prm);
    for (let i = 0; i < lenKeywords; i++) {
      if (articlePromiseResponse[i].length > 0) {
        let articles = [];
        if (articlesPromisesResponse[i].length == articleLimit + 1) {
          articles = await cutLastItem(articlePromiseResponse[i]);
        } else {
          articles = await shuffleArray(articlePromiseResponse[i]);
        }
        articles = await getRestructuredArticles(articles);
        finalListWithArticles.push({
          keywordData: keywords[i],
          articles,
        });
      }
    }

    let data = {
      finalListWithArticles,
    };
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

const cutLastItem = async (articles) => {
  let last = articles.slice(articles.length - 1);
  articles.pop();
  articles = await shuffleArray(articles);
  articles = articles.concat(last);
  return articles;
};

const shuffleArray = async (array) => {
  let len = array.length;
  for (let i = len - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

const getRestructuredArticles = async (articles) => {
  return articles.map((doc) => {
    return {
      title: doc.title,
      description: doc.description,
      price: doc.price,
      author: doc.author,
      cover: doc.cover,
      publisher: doc.publisher,
      website: doc.website,
      category: doc.category,
      time: doc.time,
      date: doc.publishingDate,
      id: doc.id,
      lan: doc.lan,
      urlStr: doc.urlStr,
      public: doc.public,
      created_at: doc.created_at,
    };
  });
};
