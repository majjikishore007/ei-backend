const Keyword = require("../models/keyword");
const Article = require("../models/article");
const Preference = require("../models/preference");
const mongoose = require("mongoose");

exports.getTrendingKeywordFromSocialMedia = async () => {};

exports.getAllKeywords = async (req, res, next) => {
  try {
    let keywords = await Keyword.find().sort({ count: -1 });
    res.status(200).json({ success: true, data: keywords });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getSingleKeywordStatus = async (req, res, next) => {
  try {
    let keyword = req.params.keywordGiven;
    let preferenceExist = await Preference.findOne({
      user: req.userData.userId,
      keyword: mongoose.Types.ObjectId(keyword),
    });
    if (!preferenceExist) {
      res
        .status(404)
        .json({ success: false, message: "Not listed in preference" });
    } else {
      res.status(200).json({ success: true, data: preferenceExist });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getInitalKeywords = async (req, res, next) => {
  try {
    let keywords = await Keyword.find()
      .sort({ count: -1 })
      .limit(+req.params.limitCount);
    res.status(200).json({ success: true, data: keywords });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getNextbatchKeywords = async (req, res, next) => {
  try {
    let lastHighestCount = req.params.lastKeywordCount;
    let keywords = await Keyword.find({
      count: { $lt: lastHighestCount },
    })
      .sort({ count: -1 })
      .limit(+req.params.limitCount);
    res.status(200).json({ success: true, data: keywords });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getkeywordswithSkippingKeywords = async (req, res, next) => {
  try {
    const userId = req.userData.userId;
    const limit = parseInt(req.params.limit);
    const page = parseInt(req.params.page);

    let keywords = await Keyword.aggregate([
      { $match: {} },
      { $sort: { count: -1 } },
      { $skip: limit * page },
      { $limit: limit },
      {
        $lookup: {
          from: Preference.collection.name,
          let: { keywordId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$keyword", "$$keywordId"] },
                    {
                      $eq: ["$user", mongoose.Types.ObjectId(userId)],
                    },
                  ],
                },
              },
            },
          ],
          as: "keywordData",
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          count: 1,
          for: 1,
          against: 1,
          created_at: 1,
          updated_at: 1,
          keyword: 1,
          selected: {
            $cond: {
              if: {
                $eq: [{ $size: "$keywordData" }, 0],
              },
              then: false,
              else: true,
            },
          },
        },
      },
    ]);
    res.status(200).json({ success: true, data: keywords });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

/**
 * descrption - this function is using to watch the upload of new article in collection so that
 * when new article get uploaded in collection that time using category we can collect all keywords and
 * put those into keyword collection
 */
exports.saveKeywordOnNewArticleUpload = async () => {
  try {
    let pipeline = [
      {
        $match: { operationType: "insert" },
      },
    ];
    let changeStreamForArticle = Article.watch(pipeline);

    changeStreamForArticle.on("change", (event) => {
      if (event.fullDocument.category) {
        addToDatabase(event.fullDocument.category);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const addToDatabase = async (str) => {
  const val = (str + "").split(",");
  for (let i = 0; i < val.length; i++) {
    if (val[i] !== undefined) {
      let kw = val[i].trim().toLowerCase();
      try {
        const keyword = new Keyword({
          keyword: kw,
        });
        await keyword.save();
      } catch (error) {
        if (error.code === 11000 && kw) {
          await Keyword.update({ keyword: kw }, { $inc: { count: 1 } });
        }
      }
    }
  }
};
