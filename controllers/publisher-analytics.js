const Publisher = require("../models/publisher");
const Article = require("../models/article");
const Comment = require("../models/comment");
const View = require("../models/view");
const ArticleCounterComment = require("../models/article_counter_comment");
const Publisherrating = require("../models/publisherRating");
const mongoose = require("mongoose");


exports.getAnalytics = async (req, res, next) => {
  try {
    let publisherId = req.params.publisherId;
    let promises = [];
    /**comments */
    let comments = Comment.aggregate([
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
                          $eq: ["$publisher", mongoose.Types.ObjectId(publisherId)],
                        },
                      ],
                    },
                  },
                },
              ],
              as: "articleData",
            },
        },
        {$unwind:'$articleData'}
    ]);

    promises.push(comments);

    let counterComments = ArticleCounterComment.aggregate([
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
                          $eq: ["$publisher", mongoose.Types.ObjectId(publisherId)],
                        },
                      ],
                    },
                  },
                },
              ],
              as: "articleData",
            },
        },
        {$unwind:'$articleData'}
    ]);

    promises.push(counterComments);

    /**article counts */
    let articleCount = Article.countDocuments({publisher:mongoose.Types.ObjectId(publisherId)});
    promises.push(articleCount);

    
    /** publisher average rating*/
    let avgRating = Publisher.aggregate([
        {$match:{_id:mongoose.Types.ObjectId(publisherId)}},
        {
          $lookup: {
            from: Publisherrating.collection.name,
            localField: "_id",
            foreignField: "publisher",
            as: "pubrating",
          },
        },
        { $unwind: { path: "$pubrating", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            verified: { $first: "$verified" },
            email: { $first: "$email" },
            about: { $first: "$about" },
            website: { $first: "$website" },
            address: { $first: "$address" },
            logo: { $first: "$logo" },
            userId: { $first: "$userId" },
            city: { $first: "$city" },
            zip: { $first: "$zip" },
            urlStr: { $first: "$urlStr" },
            count: { $sum: 1 },
            totalRating: { $sum: "$pubrating.value" },
          },
        },
        {
          $project: {
            _id: 0,
            name: 1,
            urlStr: 1,
            id: "$_id",
            averageRating: {
              $round: [{ $divide: ["$totalRating", "$count"] }, 1],
            },
          },
        },
      ]);
      promises.push(avgRating);

      
    /**publisher article view count */
    let views = View.aggregate([
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
                          $eq: ["$publisher", mongoose.Types.ObjectId(publisherId)],
                        },
                      ],
                    },
                  },
                },
              ],
              as: "articleData",
            },
        },
        {$unwind:'$articleData'}
    ]);
    promises.push(views);

    let resp = await Promise.all(promises);

      let response = {
          commentCount:resp[0].length + resp[1].length,
          articleCount:resp[2],
          averageRating:resp[3].length > 0 ?resp[3][0].averageRating:null,
          viewCount:resp[4].length
      };

    res.status(200).json({ success: true, data:response });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
