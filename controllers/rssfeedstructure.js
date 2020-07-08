const RssFeedStructure = require("../models/rss-feed-structure");

exports.getAllRssFeedStructures = async (req, res, next) => {
  try {
    let docs = await RssFeedStructure.find().populate("publisherId", "name");
    if (docs.length >= 0) {
      res.status(200).json({
        success: true,
        count: docs.length,
        data: docs,
      });
    } else {
      res.status(404).json({ success: false, message: "No entries found" });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getSingleRssFeedStructure = async (req, res, next) => {
  try {
    let doc = await RssFeedStructure.findOne({ _id: req.params.id });
    if (doc) {
      res.status(200).json({ success: true, data: doc });
    } else {
      res.status(404).json({ success: false, message: "No Entry Found" });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getSingleRssFeedStructureWithPublisherId = async (req, res, next) => {
  try {
    let doc = await RssFeedStructure.findOne({
      publisherId: req.params.publisherId,
    });
    if (doc) {
      res.status(200).json({ success: true, data: doc });
    } else {
      res.status(404).json({ success: false, message: "No Entry Found" });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.AddRssFeedStructure = async (req, res, next) => {
  try {
    let structure = {};
    if (req.body.titleField) {
      structure.titleField = req.body.titleField;
    }
    if (req.body.contentField) {
      structure.contentField = req.body.contentField;
    }
    if (req.body.descriptionField) {
      structure.descriptionField = req.body.descriptionField;
    }
    if (req.body.linkField) {
      structure.linkField = req.body.linkField;
    }
    if (req.body.pubDateField) {
      structure.pubDateField = req.body.pubDateField;
    }

    structure.publisherId = req.body.publisherId;

    if (req.body.categoryField) {
      structure.categoryField = req.body.categoryField;
    }

    if (req.body.authorField) {
      structure.authorField = req.body.authorField;
    }
    if (req.body.imageField) {
      structure.imageField = req.body.imageField;
    }

    let insertedStructure = await new RssFeedStructure(structure).save();
    res.status(201).json({
      success: true,
      message: "Rss feed structure inserted!",
      data: insertedStructure,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.updateRssFeedStructureWithId = async (req, res, next) => {
  try {
    const { id } = req.params;
    let updatedStructure = await RssFeedStructure.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Rss feed structure updated!",
      data: updatedStructure,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.deleteRssFeedStructureWithId = async (req, res, next) => {
  try {
    const { id } = req.params;
    await RssFeedStructure.remove({ _id: id });
    res
      .status(200)
      .json({ success: true, message: "Rss feed structure deleted!" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
