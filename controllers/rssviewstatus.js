const Publisher = require("../models/publisher");
const Parser = require("rss-parser");
const parser = new Parser();
const RssFeedstructure = require("../models/rss-feed-structure");
const AllContent = require("../models/all-content");
const mongoose = require("mongoose");

exports.updateVisitedStatusOfRssfeed = async (req, res, next) => {
  try {
    await AllContent.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.status(200).json({ success: true, message: "Rss feed visited marked" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.savelastrssfeedid = async (req, res, next) => {};
