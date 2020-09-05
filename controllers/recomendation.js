const Preference = require("../models/preference");
const Article = require("../models/article");
const Rating = require("../models/rating");
const View = require("../models/view");
const Audio = require("../models/audio");
const Video = require("../models/video");
const Publisher = require("../models/publisher");
const Keyword = require("../models/keyword");
const mongoose = require("mongoose");

exports.getSimilarArticles = async (req, res, next) => {
  try {
    let articleId = req.params.article;
    let limit = parseInt(req.params.limit);
    let article = await Article.findOne({
      _id: mongoose.Types.ObjectId(articleId),
    });
    if (!article) {
      return res
        .status(404)
        .josn({ success: true, message: "Article Not Found" });
    }
    let categories = article.category.toLowerCase().trim().split(",");
    let cat = [];
    categories.map((one) => {
      cat.push(one.trim().toLowerCase());
    });

    /**get preferences */
    let prefers = await Preference.aggregate([
      { $match: { user: mongoose.Types.ObjectId(req.userData.userId) } },
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
        $group: {
          _id: "keyword",
          keywords: {
            $push: "$keywordData.keyword",
          },
        },
      },
    ]);

    let similarKeywords = [];
    if (prefers.length > 0) {
      similarKeywords = [...prefers[0].keywords, ...cat];
    } else {
      similarKeywords = [...cat];
    }

    let unique = getUnique(similarKeywords);
    let regex = unique.join("|");

    let suggestedArticles = await Article.aggregate([
      {
        $match: {
          $and: [
            {
              _id: { $ne: mongoose.Types.ObjectId(articleId) },
            },
            {
              category: {
                $regex: regex,
                $options: "i",
              },
            },
            { $or: [{ device: "both" }, { device: req.params.device }] },
          ],
        },
      },
      { $sort: { _id: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: Publisher.collection.name,
          localField: "publisher",
          foreignField: "_id",
          as: "publisherData",
        },
      },
      { $unwind: "$publisherData" },
      {
        $project: {
          _id: 0,
          title: 1,
          description: 1,
          price: 1,
          author: 1,
          cover: 1,
          publisher: "$publisherData",
          website: 1,
          category: 1,
          time: 1,
          date: "$publishingDate",
          id: "$_id",
          lan: 1,
          urlStr: 1,
          public: 1,
          created_at: 1,
        },
      },
    ]);
    res.status(200).json({ success: true, data: suggestedArticles });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

const getUnique = (array) => {
  var uniqueArray = [];

  // Loop through array values
  for (i = 0; i < array.length; i++) {
    if (uniqueArray.indexOf(array[i]) === -1) {
      uniqueArray.push(array[i]);
    }
  }
  return uniqueArray;
};

exports.getLatestArticles = async (req, res, next) => {
  try {
    let limit = parseInt(req.params.limit);
    let articles = await Article.aggregate([
      { $match: { $or: [{ device: "both" }, { device: req.params.device }] } },
      { $sort: { _id: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: Publisher.collection.name,
          localField: "publisher",
          foreignField: "_id",
          as: "publisherData",
        },
      },
      { $unwind: "$publisherData" },
      {
        $project: {
          _id: 0,
          title: 1,
          description: 1,
          price: 1,
          author: 1,
          cover: 1,
          publisher: "$publisherData",
          website: 1,
          category: 1,
          time: 1,
          date: "$publishingDate",
          id: "$_id",
          lan: 1,
          urlStr: 1,
          public: 1,
          created_at: 1,
        },
      },
    ]);
    res.status(200).json({ success: true, data: articles });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

exports.getLastSevenDaysMostViewedArticles = async (req, res, next) => {
  try {
    let limit = parseInt(req.params.limit);
    let fromDate = calculateExpireDate(new Date(), 7);
    let articles = await View.aggregate([
      {
        $match: {
          date: { $gte: fromDate },
        },
      },
      { $sort: { _id: -1 } },
      {
        $group: {
          _id: "$article",
          viewCount: { $sum: "$value" },
        },
      },
      {
        $project: {
          article: "$_id",
          _id: 0,
          viewCount: 1,
        },
      },
      { $sort: { viewCount: -1, article: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: Article.collection.name,
          let: { articleId: "$article" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$articleId"] },
                    {
                      $or: [
                        { $eq: ["$device", "both"] },
                        { $eq: ["$device", req.params.device] },
                      ],
                    },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: Publisher.collection.name,
                localField: "publisher",
                foreignField: "_id",
                as: "publisherData",
              },
            },
            { $unwind: "$publisherData" },
          ],
          as: "articleData",
        },
      },
      { $unwind: "$articleData" },
      {
        $project: {
          viewCount: 1,
          _id: 0,
          title: "$articleData.title",
          description: "$articleData.description",
          price: "$articleData.price",
          author: "$articleData.author",
          cover: "$articleData.cover",
          publisher: "$articleData.publisherData",
          website: "$articleData.website",
          category: "$articleData.category",
          time: "$articleData.time",
          date: "$articleData.publishingDate",
          id: "$articleData._id",
          lan: "$articleData.lan",
          urlStr: "$articleData.urlStr",
          public: "$articleData.public",
          created_at: "$articleData.created_at",
        },
      },
    ]);
    res.status(200).json({ success: true, data: articles });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

const calculateExpireDate = (date, days) => {
  const expDate = new Date(Number(date));
  expDate.setDate(date.getDate() - days);
  return expDate;
};

exports.getTopRatedArticles = async (req, res, next) => {
  try {
    let limit = parseInt(req.params.limit);
    let result = await Rating.aggregate([
      {
        $group: {
          _id: "$article",
          average: { $avg: "$value" },
        },
      },
      {
        $project: {
          article: "$_id",
          _id: 0,
          average: 1,
        },
      },
      {
        $sort: { article: -1, average: -1 },
      },
      { $limit: limit },
      {
        $lookup: {
          from: Article.collection.name,
          let: { articleId: "$article" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$articleId"] },
                    {
                      $or: [
                        { $eq: ["$device", "both"] },
                        { $eq: ["$device", req.params.device] },
                      ],
                    },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: Publisher.collection.name,
                localField: "publisher",
                foreignField: "_id",
                as: "publisherData",
              },
            },
            { $unwind: "$publisherData" },
          ],
          as: "articleData",
        },
      },
      { $unwind: "$articleData" },
      {
        $project: {
          averageRating: "$average",
          _id: 0,
          title: "$articleData.title",
          description: "$articleData.description",
          price: "$articleData.price",
          author: "$articleData.author",
          cover: "$articleData.cover",
          publisher: "$articleData.publisherData",
          website: "$articleData.website",
          category: "$articleData.category",
          time: "$articleData.time",
          date: "$articleData.publishingDate",
          id: "$articleData._id",
          lan: "$articleData.lan",
          urlStr: "$articleData.urlStr",
          public: "$articleData.public",
          created_at: "$articleData.created_at",
        },
      },
    ]);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};
