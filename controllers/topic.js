const Topic = require("../models/topic");
const Article = require("../models/article");

exports.getAllTopics = async (req, res, next) => {
  try {
    let docs = await Topic.find();
    const response = {
      success: true,
      count: docs.length,
      data: docs.map((doc) => {
        return {
          title: doc.title,
          description: doc.description,
          cover: doc.cover,
          keywords: doc.keywords.split(","),
          user: doc.user,
          id: doc._id,
        };
      }),
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getTopicDetailsById = async (req, res, next) => {
  try {
    const id = req.params.id;
    let doc = await Topic.findById(id);
    if (doc) {
      const data = doc.keywords.split(",");
      keywords = [];
      for (i = 0; i < data.length; i++) {
        keywords.push({ category: new RegExp(data[i], "i") });
      }
      let result = await Article.find({ $or: keywords });
      res.status(200).json({ success: true, data: doc, articles: result });
    } else {
      res.status(200).json({ success: false, error: "No Valid entry found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.addNewTopic = async (req, res, next) => {
  try {
    const topic = new Topic({
      title: req.body.title,
      description: req.body.description,
      cover: req.file.cloudStoragePublicUrl,
      keywords: req.body.keywords,
      user: req.userData.userId,
      urlStr: req.body.title
        .trim()
        .replace(/[&\/\\#=, +()$~%.'":;*?!<>{}]+/gi, "-"),
    });
    let addedTopic = await topic.save();
    res.status(200).json({ success: true, data: addedTopic });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.updateTopicById = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Topic.updateOne({ _id: id }, { $set: req.body });
    res.status(200).json({ success: true, message: "Topic updated" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.deleteTopicById = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Topic.deleteOne({ _id: id });
    res.status(200).json({ success: true, message: "Topic delated" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
