const BlogComment = require("../models/blog_comment");
const BlogCounterComment = require("../models/blog_counter_comment");
const BlogCommentVote = require("../models/blog_comment_vote");
const Blog = require("../models/blog");
const User = require("../models/user");
const UserNotification = require("../models/usernotification");
const mongoose = require("mongoose");

const {
  ChangeInUserNotification,
} = require("../notification/collection-watch");

exports.getBlogCommentWithId = async (req, res, next) => {
  try {
    const id = req.params.id;
    let doc = await BlogComment.findById(id).populate("user").populate("blog");
    if (doc) {
      res.status(200).json({ success: true, data: doc });
    } else {
      res.status(200).json({ success: false, message: "No Valid entry found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.addBlogComment = async (req, res, next) => {
  try {
    const blogComment = new BlogComment({
      blog: req.body.blog,
      user: req.userData.userId,
      message: req.body.message,
    });
    let result = await blogComment.save();

    /**aggregate the debatearticles and get articles-> publisher.userId -> create Notification For each */

    let blogResult = await Blog.findOne({
      _id: mongoose.Types.ObjectId(req.body.blog),
    }).populate("author");

    let userResult = await User.findOne({ _id: req.userData.userId });
    if (blogResult.author) {
      let usernotification = new UserNotification({
        notificationType: "comment-on-blog",
        message: `${userResult.displayName} commented on your Blog`,
        sender: req.userData.userId,
        reciever: blogResult.author ? blogResult.author._id : null,
        blog: req.body.blog,
        blogComment: result ? result._id : null,
        date: Date.now(),
      });
      let notification = await usernotification.save();
      await ChangeInUserNotification(notification, "comment-on-blog");
    }

    let datas = JSON.parse(JSON.stringify(result));
    datas.userData = userResult;

    res.status(201).json({ success: true, data: datas });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.updateBlogCommentById = async (req, res, next) => {
  try {
    const id = req.params.id;
    await BlogComment.updateOne(
      { _id: id, user: req.userData.userId },
      { $set: req.body }
    );
    res.status(200).json({ success: true, message: "Blog comment updated" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.deleteBlogComment = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = req.userData.userId;
    await Promise.all([
      BlogComment.deleteOne({ $and: [{ _id: id }, { user: userId }] }),
      BlogCommentVote.deleteMany({ comment: id }),
      BlogCounterComment.deleteMany({ parent_comment: id }),
    ]);
    res
      .status(200)
      .json({ success: true, message: "Comment remove from Blog" });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

exports.getBlogCommentsForBlogId = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    const blog_id = req.params.id;
    let result = await BlogComment.find({ blog: blog_id })
      .sort("-_id")
      .skip(page * limit)
      .limit(limit)
      .populate("user");

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

exports.getAllCommentsForBlogId = async (req, res, next) => {
  try {
    const blog_id = mongoose.Types.ObjectId(req.params.id);
    let result = await BlogComment.aggregate([
      { $match: { blog: blog_id } },
      {
        $lookup: {
          from: User.collection.name,
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: "$userData" },
      {
        $lookup: {
          from: BlogCounterComment.collection.name,
          let: { commentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$parent_comment", "$$commentId"] }],
                },
              },
            },
            {
              $lookup: {
                from: User.collection.name,
                localField: "user",
                foreignField: "_id",
                as: "userData",
              },
            },
            { $unwind: "$userData" },
          ],
          as: "counterComments",
        },
      },
      {
        $lookup: {
          from: BlogCommentVote.collection.name,
          let: { commentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$comment", "$$commentId"] }],
                },
              },
            },
            {
              $lookup: {
                from: User.collection.name,
                localField: "user",
                foreignField: "_id",
                as: "userData",
              },
            },
            { $unwind: "$userData" },
          ],
          as: "commentVotes",
        },
      },
    ]);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

exports.getBlogCommentsPagination = async (req, res, next) => {
  try {
    /**blog id */
    let blogId = req.params.id;

    /**comment */
    let commentPage = parseInt(req.params.commentPage);
    let commentLimit = parseInt(req.params.commentLimit);

    /**counter comment */
    let counterCommentPage = parseInt(req.params.counterCommentPage);
    let counterCommentLimit = parseInt(req.params.counterCommentLimit);

    let blogComments = await BlogComment.aggregate([
      { $match: { blog: mongoose.Types.ObjectId(blogId) } },
      { $sort: { _id: -1 } },
      { $skip: commentPage * commentLimit },
      { $limit: commentLimit },
      {
        $lookup: {
          from: User.collection.name,
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: "$userData" },
      {
        $lookup: {
          from: BlogCounterComment.collection.name,
          let: { commentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$parent_comment", "$$commentId"] }],
                },
              },
            },
            { $sort: { _id: -1 } },
            { $skip: counterCommentPage * counterCommentLimit },
            { $limit: counterCommentLimit },
            {
              $lookup: {
                from: User.collection.name,
                localField: "user",
                foreignField: "_id",
                as: "userData",
              },
            },
            { $unwind: "$userData" },
          ],
          as: "counterComments",
        },
      },
      {
        $lookup: {
          from: BlogCommentVote.collection.name,
          let: { commentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$comment", "$$commentId"] }],
                },
              },
            },
            {
              $lookup: {
                from: User.collection.name,
                localField: "user",
                foreignField: "_id",
                as: "userData",
              },
            },
            { $unwind: "$userData" },
          ],
          as: "commentVotes",
        },
      },
    ]);

    res.status(200).json({ success: true, data: blogComments });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

exports.getBlogCounterCommentsPagination = async (req, res, next) => {
  try {
    /**blog id */
    let blogId = req.params.blogId;

    /**comment id */
    let commentId = req.params.commentId;

    /**counter comment */
    let counterCommentPage = parseInt(req.params.counterCommentPage);
    let counterCommentLimit = parseInt(req.params.counterCommentLimit);

    let blogCounterComments = await BlogCounterComment.aggregate([
      {
        $match: {
          $and: [
            { blog: mongoose.Types.ObjectId(blogId) },
            { parent_comment: mongoose.Types.ObjectId(commentId) },
          ],
        },
      },
      { $sort: { _id: -1 } },
      { $skip: counterCommentPage * counterCommentLimit },
      { $limit: counterCommentLimit },
      {
        $lookup: {
          from: User.collection.name,
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: "$userData" },
    ]);

    res.status(200).json({ success: true, data: blogCounterComments });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};
