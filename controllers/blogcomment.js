const BlogComment = require("../models/blog_comment");
const Blog = require("../models/blog");
const User = require("../models/user");
const UserNotification = require("../models/usernotification");
const mongoose = require("mongoose");

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

    if (blogResult.author) {
      let userResult = await User.findOne({ _id: req.userData.userId });
      let usernotification = new UserNotification({
        notificationType: "comment-on-blog",
        message: `${userResult.displayName} commented on your Blog`,
        sender: req.userData.userId,
        reciever: blogResult.author ? blogResult.author._id : null,
        blog: req.body.blog,
        blogComment: result ? result._id : null,
        date: Date.now(),
      });
      await usernotification.save();
    }

    res.status(201).json({ success: true, data: result });
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
    await BlogComment.deleteOne({ $and: [{ _id: id }, { user: userId }] });
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