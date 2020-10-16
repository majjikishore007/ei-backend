const Debate = require("../models/debate");
const authCheck = require("../middleware/check-auth");
const Article = require("../models/article");
const urlify = require('../util/util')

exports.getAllDebates = async (req, res, next) => {
  try {
    let docs = await Debate.find();
    const response = {
      success: true,
      count: docs.length,
      debates: docs.map((doc) => {
        return {
          title: doc.title,
          description: doc.description,
          cover: doc.cover,
          keywords: doc.keywords.split(","),
          moderator: doc.moderator,
          start_date: doc.start_date,
          end_date: doc.end_date,
          id: doc._id,
        };
      }),
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getAllDebatesPagination = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    let docs = await Debate.find()
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit);
    const response = {
      success: true,
      count: docs.length,
      debates: docs.map((doc) => {
        return {
          title: doc.title,
          description: doc.description,
          cover: doc.cover,
          keywords: doc.keywords.split(","),
          moderator: doc.moderator,
          start_date: doc.start_date,
          end_date: doc.end_date,
          id: doc._id,
        };
      }),
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getDebateById = async (req, res, next) => {
  try {
    const id = req.params.id;
    let result = await Debate.findById(id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getDebateWithArticles = async (req, res, next) => {
  try {
    const id = req.params.id;
    let doc = await Debate.findById(id);

    if (doc) {
      const data = doc.keywords.split(",");
      keywords = [];
      for (i = 0; i < data.length; i++) {
        keywords.push({ category: new RegExp(data[i], "i") });
      }
      let result = await Article.find({ $or: keywords });

      res.status(200).json({ success: true, debate: doc, articles: result });
    } else {
      res.status(200).json({ success: false, error: "No Valid entry found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.addNewDebate = async (req, res, next) => {
  try {
    const debate = new Debate({
      title: req.body.title,
      description: req.body.description,
      cover: req.file.cloudStoragePublicUrl,
      keywords: req.body.keywords,
      moderator: req.userData.userId,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      urlStr: urlify(req.body.title),
    });
    let result = await debate.save();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.updateDebate = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Debate.updateOne({ _id: id }, { $set: req.body });
    res.status(200).json({ success: true, message: "Debate updated" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.updateDebateImage = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = {
      cover: req.file.cloudStoragePublicUrl,
    };
    await Debate.updateOne({ _id: id }, { $set: data });

    res.status(200).json({ success: true, message: "Image has been updated" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.deleteDebate = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Debate.deleteOne({ _id: id });
    res.status(200).json({ success: true, message: "Debate delated" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
