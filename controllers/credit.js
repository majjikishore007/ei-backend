const Article = require("../models/article");
const Credit = require("../models/credit");
const mongoose = require("mongoose");
const User = require("../models/user");
const Publisher = require("../models/publisher");

exports.getAllCredits = async (req, res, next) => {
  try {
    let credits = await Credit.find();
    res.status(200).json({ success: true, data: credits });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.saveCredit = async (req, res, next) => {
  try {
    await User.findById(req.userData.userId);
    if (req.credits >= req.body.credit) {
      const creditDoc = new Credit({
        credit: -1 * req.body.credit,
        amount: -1 * req.body.amount,
        user: req.userData.userId,
        publisher: req.body.publisher,
        pub_amount: (-1 * req.body.amount) / 2,
        article: req.body.article,
        capture: true,
        created_at: Date.now(),
      });
      await creditDoc.save();
      await User.updateOne(
        { _id: req.userData.userId },
        { $inc: { credits: -1 * req.body.credit } }
      );
      res.status(200).json({
        success: true,
        message: "credit has been used for this article",
      });
    } else {
      res.status(400).json({
        success: false,
        error: "you don't have enough credit for this article",
      });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(500).json({
        success: false,
        message: "Thankyou, But you alreday paid for this article.",
      });
    }
    res.status(500).json({ error });
  }
};

exports.getCreditByArticleId = async (req, res, next) => {
  try {
    const articleId = req.params.id;
    const d = new Date();
    d.setDate(d.getDate() - 14);
    let result = await Credit.aggregate([
      {
        $match: {
          $and: [
            { article: mongoose.Types.ObjectId(articleId) },
            { created_at: { $gt: d } },
          ],
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$created_at" },
            month: { $month: "$created_at" },
            day: { $dayOfMonth: "$created_at" },
          },
          total: { $sum: "$credit" },
          user: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      { $limit: 14 },
    ]);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getCreditByUserAndArticleId = async (req, res, next) => {
  try {
    const articleId = req.params.id;
    let result = await Credit.countDocuments({
      $and: [{ article: articleId }, { user: req.userData.userId }],
    });
    if (result > 0) {
      res.status(200).json({ success: true, message: "Paid" });
    } else {
      res.status(404).json({ success: false, message: "Unpaid" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Unpaid" });
  }
};

exports.getEarningForArticles = async (req, res, next) => {
  try {
    const article = req.params.id;
    let credits = await Credit.aggregate([
      { $match: {} },
      { $group: { _id: "$articleId", total: { $sum: "$credit" } } },
    ]);
    if (credits.length > 0) {
      res.json({ success: true, data: credits[0].total });
    } else {
      res.json({ success: false, data: 0 });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getEarningWithArticleId = async (req, res, next) => {
  try {
    const article = req.params.id;
    let result = await Credit.aggregate([
      { $match: { article: mongoose.Types.ObjectId(article) } },
      { $group: { _id: "$article", total: { $sum: "$credit" } } },
    ]);
    if (result.length > 0) {
      result[0].total = (-1 * result[0].total) / 4;
      res.json({ success: true, data: result[0].total });
    } else {
      res.json({ success: false, data: 0 });
    }
  } catch (error) {
    res.json({ success: false, data: 0 });
  }
};

exports.getCreditsForLoggedinuser = async (req, res, next) => {
  try {
    let result = await Credit.find({
      $and: [{ user: req.userData.userId }, { bank: false }],
    })
      .sort("-_id")
      .populate("article", "title urlStr");
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.aggregateCreditForLoggedinUser = async (req, res, next) => {
  try {
    let result = await Credit.aggregate([
      {
        $match: {
          $and: [
            { user: mongoose.Types.ObjectId(req.userData.userId) },
            { capture: true },
            { bank: false },
          ],
        },
      },
      { $group: { _id: null, total: { $sum: "$credit" } } },
    ]);
    res.status(200).json({ success: true, credits: result[0].total });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getPurchaseArticleDetailsForLoggedinUser = async (req, res, next) => {
  try {
    Credit.find({
      $and: [{ user: req.userData.userId }, { credit: { $lt: 0 } }],
    })
      .select("article")
      .populate("article")
      .exec((err, publisher) => {
        Publisher.populate(publisher, {
          path: "article.publisher",
        }).then((result) => {
          res.status(200).json({ success: true, result: result });
        });
      });
  } catch (error) {
    res.status(500).json({ err: false, error: err });
  }
};

exports.aggregateEarningOfPublisherId = async (req, res, next) => {
  try {
    const publisherId = req.params.id;
    let result = await Credit.aggregate([
      { $match: { publisher: mongoose.Types.ObjectId(publisherId) } },
      { $group: { _id: "$publisher", total: { $sum: "$credit" } } },
    ]);
    if (result.length > 0) {
      result[0].total = (-1 * result[0].total) / 2;
      res.status(200).json({
        success: true,
        data: { credit: result[0].total, earning: result[0].total / 4 },
      });
    } else {
      res.status(200).json({ success: true, data: { credit: 0, earning: 0 } });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.gettingDetailsOfPublisherId = async (req, res, next) => {
  try {
    const publisherId = req.params.id;
    let result = await Credit.find({ publisher: publisherId }).sort("-_id");
    res.status(200).json({ success: true, result: result });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.addPublisherPayment = async (req, res, next) => {
  try {
    const creditDoc = new Credit({
      credit: req.body.credit,
      amount: req.body.amount,
      pub_amount: req.body.amount / 2,
      user: req.userData.userId,
      publisher: req.body.publisher,
      capture: true,
      created_at: Date.now(),
      bank: true,
    });
    let result = await creditDoc.save();
    res.status(200).json({ success: true, result: result });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
