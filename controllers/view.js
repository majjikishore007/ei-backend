const View = require("../models/view");
const Article = require("../models/article");
const Publisher = require("../models/publisher");
const mongoose = require("mongoose");

exports.saveView = async (req, res, next) => {
  try {
    const view = new View({
      value: 1,
      user: req.userData.userId,
      article: req.body.article,
      date: Date.now(),
    });
    await view.save();
    res.status(200).json({ success: true, message: "Page viewed" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getViewByArticleId = async (req, res, next) => {
  try {
    const articleId = req.params.id;
    const d = new Date();
    d.setDate(d.getDate() - 14);
    let result = await View.aggregate([
      {
        $match: {
          $and: [
            { article: mongoose.Types.ObjectId(articleId) },
            { date: { $gt: d } },
          ],
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" },
          },
          total: { $sum: "$value" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      { $limit: 14 },
    ]);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.aggregateByArticleId = async (req, res, next) => {
  try {
    const articleId = req.params.id;
    let result = await View.aggregate([
      { $match: { article: mongoose.Types.ObjectId(articleId) } },
      {
        $group: {
          _id: "$article",
          total: { $sum: "$value" },
        },
      },
    ]);
    if (result.length > 0) {
      res.status(200).json({ success: true, data: result[0].total });
    } else {
      res.status(200).json({ success: false, data: 0 });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getViewArticleByUser = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    let articleViews = await View.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(req.userData.userId),
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $skip: page * limit,
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
                  $eq: ["$_id", "$$articleId"],
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
            {
              $project: {
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
                _id: 0,
                lan: 1,
                urlStr: 1,
                public: 1,
                altImage: 1,
                seo: 1,
                publisherId: "$publisherData._id" ? "$publisherData._id" : null,
              },
            },
          ],
          as: "articleData",
        },
      },
      { $unwind: "$articleData" },
      {
        $project: {
          value: 1,
          article: "$articleData",
          date: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data: articleViews });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

exports.getAllViews = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    let articleViews = await View.find({})
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate({
        path: "article",
        populate: {
          path: "publisher",
          model: "Publisher",
        },
      });
    res.status(200).json({ success: true, data: articleViews });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
