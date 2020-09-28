const Blog = require("../models/blog");
const mongoose = require("mongoose");

exports.getAllBlogPosts = async (req, res, next) => {
  try {
    let blogs = await Blog.find()
      .sort({ _id: -1 })
      .limit(+req.params.limitCount)
      .populate("author", "displayName thumbnail");
    res.status(200).json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getAllBlogsPagination = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);
    let blogs = await Blog.find()
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate("author", "displayName thumbnail");
    res.status(200).json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
exports.getNextBatchBlogs = async (req, res, next) => {
  try {
    const lastBlogId = req.params.lastBlogId;
    let blogs = await Blog.find({
      _id: { $lt: mongoose.Types.ObjectId(lastBlogId) },
    })
      .sort({ _id: -1 })
      .limit(+req.params.limitCount)
      .populate("author", "displayName");
    res.status(200).json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {}
};

exports.getBlogsFilteredByCategory = async (req, res, next) => {
  try {
    const cat = req.params.paramp;
    let blogs = await Blog.find({ category: new RegExp(cat, "i") })
      .sort({ _id: -1 })
      .populate("author");
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getBlogById = async (req, res, next) => {
  try {
    const id = req.params.id;
    let blog = await Blog.findById(id).populate("author");
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getBlogByTitle = async (req, res, next) => {
  try {
    const urlStr = req.params.title;
    let blog = await Blog.findOne({ urlStr: urlStr }).populate("author");
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.saveBlog = async (req, res, next) => {
  try {
    const blog = new Blog({
      title: req.body.title,
      description: req.body.description,
      cover: req.file.cloudStoragePublicUrl,
      author: req.userData.userId,
      content: req.body.content,
      category: req.body.category,
      created_at: Date.now(),
      updated_at: Date.now(),
      seo: {
        metaTitle: req.body.metaTitle,
        metaKeywords: req.body.metaKeywords,
        metaDescription: req.body.metaDescription,
      },
      urlStr: req.body.title
        .trim()
        .replace(/[&\/\\#, +()$~%.'":*?!<>{}]+/gi, "-"),
    });
    let savedBlog = await blog.save();
    res.status(200).json({ success: true, data: savedBlog });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.updateBlogById = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Blog.update({ _id: id }, { $set: req.body });
    res.status(200).json({
      success: true,
      message: "update blog successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.deleteBlogById = async (req, res, next) => {
  try {
    const id = req.params.id;
    let deletedBlog = await Blog.remove({ _id: id });
    res.status(200).json({
      success: true,
      message: "Deleted Successfully",
      data: deletedBlog,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
