const Publisher = require("../models/publisher");
const Article = require("../models/article");
const Follow = require("../models/follow");
const mongoose = require("mongoose");
const urlify = require('../util/util')

exports.getPublishers = async (req, res, next) => {
  try {
    let publishers = await Publisher.aggregate([
      { $sort: { name: 1 } },
      {
        $project: {
          _id: 0,
          name: 1,
          email: 1,
          about: 1,
          website: 1,
          address: 1,
          logo: 1,
          userId: 1,
          verified: 1,
          urlStr: 1,
          id: "$_id",
        },
      },
    ]);
    if (publishers.length >= 0) {
      res.status(200).json({ success: true, data: publishers });
    } else {
      res.status(404).json({ success: false, message: "No entries found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.createNewPublisher = async (req, res, next) => {
  try {
    let obj = {
      name: req.body.name,
      email: req.body.email,
      about: req.body.about,
      website: req.body.website,
      address: req.body.address,
      city: req.body.city,
      zip: req.body.zip,
      logo: req.file.cloudStoragePublicUrl,
      userId: req.userData.userId,
      urlStr: urlify(req.body.name),
    };
    if (req.body.feedurl) {
      obj.feedurl = req.body.feedurl;
    }
    const publisher = new Publisher(obj);
    await publisher.save();
    res.status(201).json({ success: true, message: "publisher page created" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getPublisherById = async (req, res, next) => {
  try {
    const id = req.params.id;
    let publisher = await Publisher.findById(id);
    if (publisher) {
      res.status(200).json({ success: true, data: publisher });
    } else {
      res.status(404).json({ success: false, message: "No valid entery" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getPublisherByUrlStr = async (req, res, next) => {
  try {
    const urlStr = req.params.urlStr;
    let publisher = await Publisher.find({ urlStr: urlStr });
    if (publisher) {
      res.status(200).json({ success: true, data: publisher });
    } else {
      res.status(404).json({ success: false, message: "No valid entery" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getPublisherByUserId = async (req, res, next) => {
  try {
    const id = req.userData.userId;
    let publisher = await Publisher.find({ userId: id });
    if (publisher) {
      res.status(200).json({ success: true, data: publisher });
    } else {
      res.status(200).json({ success: false, message: "No publisher" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

exports.updatePublisherById = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Publisher.update({ _id: id }, { $set: req.body });
    res.status(200).json({ success: true, message: "Publisher page updated" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.deletePublisherById = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Publisher.remove({ _id: id });
    res.status(200).json({ success: true, message: "Publisher page removed" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.updatePublisherLogo = async (req, res, next) => {
  try {
    const id = req.params.id;
    let data = {
      logo: req.file.cloudStoragePublicUrl,
    };
    await Publisher.findByIdAndUpdate(id, { $set: data });
    res
      .status(200)
      .json({ success: true, message: "Publisher logo has been updated" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getPublisherByAggregate = async (req, res, next) => {
  try {
    let promiseArray = [];
    let publisherPromise = Publisher.find();
    promiseArray.push(publisherPromise);

    let articlesPromise = Article.aggregate([
      { $group: { _id: "$publisher", total: { $sum: 1 } } },
    ]);

    promiseArray.push(articlesPromise);

    let response = await Promise.all(promiseArray);
    let publishers = response[0];
    let result = response[1];
    output = {};
    for (var i = 0; i < result.length; i++) {
      output[result[i]._id] = result[i].total;
    }
    res.status(200).json({ success: true, data: publishers, counts: output });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getPublisherByAggregatePagination = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    let publishers = await Publisher.aggregate([
      { $sort: { _id: 1 } },
      { $skip: page * limit },
      { $limit: limit },
      {
        $lookup: {
          from: Article.collection.name,
          localField: "_id",
          foreignField: "publisher",
          as: "articles",
        },
      },
      {
        $project: {
          feedurl: 1,
          income: 1,
          verified: 1,
          name: 1,
          email: 1,
          about: 1,
          website: 1,
          address: 1,
          logo: 1,
          userId: 1,
          city: 1,
          zip: 1,
          urlStr: 1,
          articleCount: { $size: "$articles" },
        },
      },
    ]);
    res.status(200).json({ success: true, data: publishers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};
