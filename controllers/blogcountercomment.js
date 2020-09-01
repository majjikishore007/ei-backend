const BlogCounterComment = require("../models/blog_counter_comment");
const BlogComment = require("../models/blog_comment");
const Blog = require("../models/blog");
const User = require("../models/user");
const UserNotification = require("../models/usernotification");
const mongoose = require("mongoose");

const {
  ChangeInUserNotification,
} = require("../notification/collection-watch");

exports.getCounterCommentWithparentComment = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    const parent_comment_id = req.params.id;
    let result = await BlogCounterComment.find({
      parent_comment: parent_comment_id,
    })
      .sort("-_id")
      .skip(page * limit)
      .limit(limit)
      .populate("blog")
      .populate("user");
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.addCounterCommentForBlog = async (req, res, next) => {
  try {
    const blogCounterComment = new BlogCounterComment({
      blog: req.body.blog,
      user: req.userData.userId,
      parent_comment: req.body.comment,
      message: req.body.message,
    });

    let result = await blogCounterComment.save();
    /************************************/

    let blogResult = await Blog.findOne({
      _id: mongoose.Types.ObjectId(req.body.blog),
    }).populate("author");

    let userResult = await User.findOne({ _id: req.userData.userId });

    let usernotificationForAuthor = new UserNotification({
      notificationType: "comment-on-blog",
      message: `${userResult.displayName} commented on your Blog`,
      sender: req.userData.userId,
      reciever: blogResult.author ? blogResult.author._id : null,
      blog: req.body.blog,
      blogComment: result ? result._id : null,
      date: Date.now(),
    });

    await usernotificationForAuthor.save();

    let originalComment = await BlogComment.findById(
      mongoose.Types.ObjectId(req.body.comment)
    );
    let usernotification = new UserNotification({
      notificationType: "counter-comment-on-blog",
      message: `${userResult.displayName} replied to your comment`,
      sender: req.userData.userId,
      reciever: originalComment.user,
      blog: req.body.blog,
      blogParentComment: req.body.comment,
      blogComment: result ? result._id : null,
      date: Date.now(),
    });
    let notification = await usernotification.save();
    await ChangeInUserNotification(notification, "counter-comment-on-blog");

    let datas = JSON.parse(JSON.stringify(result));
    datas.userData = userResult;
    res.status(201).json({ success: true, data: datas });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.updateBlogCounterCommentById = async (req, res, next) => {
  try {
    const id = req.params.id;
    await BlogCounterComment.updateOne(
      { _id: id, user: req.userData.userId },
      { $set: req.body }
    );
    res
      .status(200)
      .json({ success: true, message: "Blog counter comment updated" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.deleteCommentById = async (req, res, next) => {
  try {
    const id = req.params.id;
    await BlogCounterComment.deleteOne({
      _id: id,
      user: req.userData.userId,
    });
    res.json({ success: true, message: "message has been deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
