const DebateArticle = require("../models/debate_article");

exports.getDebateArticleById = async (req, res, next) => {
  try {
    const id = req.params.id;
    let doc = await DebateArticle.findById(id);
    if (doc) {
      res.status(200).json({ success: true, data: doc });
    } else {
      res.status(200).json({ success: false, error: "No Valid entry found" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getDebateForById = async (req, res, next) => {
  try {
    const debate_id = req.params.id;
    let result = await DebateArticle.find({
      $and: [{ debate: debate_id }, { type: true }],
    }).populate([{
      path: 'article',
      model :'Article',
      select : 'title urlStr cover description website',
      populate : {
        path: 'publisher',
        model : 'Publisher',
        select: 'logo name urlStr'
        
      }
    }
    ])
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getDebateAgainstById = async (req, res, next) => {
  try {
    const debate_id = req.params.id;
    let result = await DebateArticle.find({
      $and: [{ debate: debate_id }, { type: false }],
    }).populate([{
      path: 'article',
      model :'Article',
      select : 'title urlStr cover description website',
      populate : {
        path: 'publisher',
        model : 'Publisher',
        select: 'logo name urlStr'
        
      }
    }
    ])
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.addDebateArticle = async (req, res, next) => {
  try {
    const debateArticle = new DebateArticle({
      debate: req.body.debate,
      article: req.body.article,
      type: req.body.type,
      user: req.userData.userId,
    });
    let result = await debateArticle.save();
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.deleteDebateArticle = async (req, res, next) => {
  try {
    const id = req.params.id;
    await DebateArticle.deleteOne({ _id: id });

    res
      .status(200)
      .json({ success: true, message: "Article remove from debate" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getDebateWitharticleIdDebateId = async (req, res, next) => {
  try {
    const debate_id = req.params.id1;
    const article_id = req.params.id2;
    let result = await DebateArticle.findOne({
      $and: [{ debate: debate_id }, { article: article_id }],
    });
    if (result) {
      res.status(200).json({ success: true, data: result });
    } else {
      res.status(200).json({ success: false, error: "No data found" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};
